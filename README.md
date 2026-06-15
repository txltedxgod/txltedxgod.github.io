# Portfolio

Multilingual (English / Українська / Русский) single-file portfolio website.
The site lives in [`docs/index.html`](docs/index.html) so it can be served by GitHub Pages.

## Features
- 🌍 3 languages with an instant switcher (remembers your choice)
- 🌗 Automatic light / dark theme
- 📱 Fully responsive
- ⚡ Zero dependencies — one HTML file

## Contacts
- Telegram: [@seocry](https://t.me/seocry)
- Email: seidoutakidzava@gmail.com

## Deploy on GitHub Pages (from the `/docs` folder)
1. Push this repository (with the `docs/` folder) to GitHub.
2. Open **Settings → Pages**.
3. Under **Source**, choose the `main` branch and the **`/docs`** folder.
4. Save — the site goes live at `https://txltedxgod.github.io/<repo-name>/`.

## Project structure
```
.
├─ README.md
└─ docs/
   └─ index.html   ← the website (served by GitHub Pages)
```

## Editing
All text lives in the `dict` object inside `docs/index.html` (`en`, `uk`, `ru`).
Edit those values to update every language at once.
