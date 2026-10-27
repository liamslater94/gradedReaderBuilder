# 🛵 Saigon Reader

An interactive graded reader for learning **Southern Vietnamese (Saigon dialect)** through short stories set in Saigon.

It's a Progressive Web App: plain HTML/CSS/JS with no build step. It installs on **iPhone, iPad, Android, Mac and Windows** and works offline.

## Features

- **7 graded stories** across 3 levels, all set in Saigon: an alley in Quận 3, a bánh mì cart, a sidewalk café, a xe ôm ride to Bến Thành, an afternoon downpour, haggling at the market, and Tết at grandma's.
- **Tap any word** to see its meaning, hear it spoken, and save it as a flashcard. Multi-syllable words (`cà phê sữa đá`, `nón bảo hiểm`) are recognised as one word.
- **Southern words are underlined** and show their Northern equivalent (🌴 *mắc*, Bắc: *đắt*), plus pronunciation and usage notes.
- **Listen** to single sentences or a whole page (uses the device's Vietnamese text-to-speech voice).
- **Per-sentence English** you can reveal when you get stuck.
- **Comprehension quizzes** with stars, plus **Saigon culture notes** at the end of each story.
- **Spaced-repetition flashcards** (Ôn tập) for your saved words.
- **Nam–Bắc dictionary** and a *“Which one is Saigon?”* mini-game.
- **XP, levels and daily streaks** (from *Khách du lịch* to *Sài Gòn chính hiệu*), light/dark mode, and adjustable text size and speech speed.
- Progress is stored on the device (localStorage). No account, no server.

## Run it locally

```bash
cd saigon-reader
python3 -m http.server 8000     # or: npm run serve
# open http://localhost:8000
```

ES modules and the service worker need a web server; opening `index.html` directly from disk won't work.

## Put it on your iPhone / desktop

1. **Host it.** The included workflow (`.github/workflows/saigon-reader-pages.yml`) publishes this folder to GitHub Pages on every push to `master`. Turn it on once in the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The app will then be live at `https://<user>.github.io/<repo>/`. Any static host also works (Netlify, Vercel, Cloudflare Pages): just upload this folder.
2. **Install it:**
   - **iPhone / iPad:** open the URL in **Safari** → **Share** → **Add to Home Screen**. It launches full-screen with its own icon and works offline.
   - **Android:** in Chrome, use **⋮ → Install app**.
   - **Windows / Mac / Linux (Chrome or Edge):** click the install icon in the address bar, or **⋮ → Cast, save and share → Install page as app**.
   - **Mac (Safari 17+):** **File → Add to Dock**.

### Want it in the App Store?

The PWA covers home-screen and desktop installs. For a store listing, wrap this same folder:
- **iOS / Android:** [Capacitor](https://capacitorjs.com/). Run `npm i @capacitor/core @capacitor/cli @capacitor/ios`, `npx cap init`, set `webDir` to `saigon-reader`, then `npx cap add ios` and open the project in Xcode. This needs a Mac and an Apple Developer account.
- **Native desktop app:** [Tauri](https://tauri.app/) or Electron, pointing at this folder.

## Adding stories

Stories live in `js/data/stories.js`. Each sentence is a `[vietnamese, english]` pair. Words are looked up in the story's `vocab` first, then in the shared glossary in `js/data/dictionary.js`. Give an entry a `north` field to mark it as Southern.

Run the content checker to find any words missing from the glossary:

```bash
npm run check
```

When you change app files, bump `VERSION` in `sw.js` so installed copies update promptly.

## Notes

- Audio uses the browser's built-in Vietnamese voice. Most system voices have a Northern accent, which is why the word notes point out Saigon pronunciations (e.g. *không* → *hông*, *về* → *dìa*). If no Vietnamese voice is installed, add one in your OS speech settings (iOS: Settings → Accessibility → Spoken Content → Voices → Vietnamese).
- Icons are generated from `icons/*.svg` with `npm run icons` (uses Playwright).
