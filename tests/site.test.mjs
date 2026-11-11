import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const docsHtmlPath = path.join(ROOT, 'docs', 'index.html');
const rootHtmlPath = path.join(ROOT, 'index.html');

const docsHtml = fs.readFileSync(docsHtmlPath, 'utf8');
const rootHtml = fs.readFileSync(rootHtmlPath, 'utf8');

test('docs/index.html and root index.html stay in sync', () => {
  assert.equal(docsHtml, rootHtml, 'docs/index.html differs from root index.html');
});

test('required static assets exist in docs/ and root', () => {
  for (const rel of ['docs/favicon.svg', 'docs/og.png', 'favicon.svg']) {
    const full = path.join(ROOT, rel);
    assert.ok(fs.existsSync(full), `Missing static asset: ${rel}`);
    assert.ok(fs.statSync(full).size > 0, `Static asset is empty: ${rel}`);
  }
  assert.match(docsHtml, /<meta\s+property="og:image"\s+content="https:\/\/txltedxgod\.github\.io\/og\.png"\s*\/?>/);
  assert.match(docsHtml, /<link\s+rel="icon"[^>]+href="favicon\.svg"\s*\/?>/);
});

test('all static SVG <use> icon references resolve to defined symbols', () => {
  const symbolIds = new Set([...docsHtml.matchAll(/<symbol\s+id="([^"]+)"/g)].map(m => m[1]));
  assert.ok(symbolIds.size > 0, 'No SVG symbols found');

  for (const match of docsHtml.matchAll(/<use\s+href="#([^"${}]+)"\s*\/?>/g)) {
    const targetId = match[1];
    assert.ok(symbolIds.has(targetId), `Missing SVG <symbol id="${targetId}">`);
  }
  assert.ok(symbolIds.has('icon-sun'));
  assert.ok(symbolIds.has('icon-moon'));
});

test('inline JavaScript parses cleanly and i18n dictionaries share matching keys', () => {
  const scripts = [...docsHtml.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  assert.ok(scripts.length > 0, 'Expected at least one inline <script> block');

  for (const code of scripts) {
    assert.doesNotThrow(() => new vm.Script(code), 'Inline JS syntax error detected');
  }

  // Evaluate dict definition in isolation to verify translation key parity
  const mainScript = scripts[scripts.length - 1];
  const dictMatch = mainScript.match(/const dict = (\{[\s\S]*?\n\});/);
  assert.ok(dictMatch, 'Could not locate i18n dict object in script');

  const box = {};
  vm.runInNewContext(`result = (${dictMatch[1]});`, box);
  const enKeys = Object.keys(box.result.en).sort();
  const ukKeys = Object.keys(box.result.uk).sort();
  assert.deepEqual(ukKeys, enKeys, 'English and Ukrainian i18n keys should match');
});
