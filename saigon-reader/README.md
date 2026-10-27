# 🛵 Saigon Reader

A daily graded reader for learning **Southern Vietnamese (Saigon dialect)** through short illustrated stories set in Saigon. Each day brings a new story whose difficulty adapts to how you did the day before.

It's a Progressive Web App: plain HTML/CSS/JS with no build step. It installs on **iPhone, iPad, Android, Mac and Windows** and works offline.

## What's inside

- **25 stories across 5 levels** (5 per level), from *Ly Nước Mía* (Level 1, a few short sentences) to *Ông Già Bán Vé Số* and *Triều Cường* (Level 5, long reflective narration). Settings include alleys, cơm tấm stalls, snail nights in Quận 4, Chợ Lớn, the new metro, the Mekong Delta, weddings and Tết.
- **A daily story that adapts** (see below). It comes in four steps:
  1. 🖼️ **New words**: picture cards for the story's key vocabulary
  2. 📖 **Read**: illustrated pages; tap any word or picture
  3. ❓ **Questions**: comprehension (multiple choice and true/false), plus picture-matching and listening questions on the new words
  4. ⭐ **Rate it**: easy / just right / too hard
- **Pictures on every page**: SVG Saigon backdrops (tube houses and power lines, markets, cafés, the river, the metro, rain, floods, lanterns) with labelled picture items you can tap to hear the word.
- **Tap any word** for its meaning, its Northern equivalent if it's a Southern word (🌴 *mắc*, Bắc: *đắt*), usage notes, **Saigon pronunciation tips**, audio and ⭐ save-to-flashcards.
- **Spaced-repetition flashcards** (*Ôn tập*). Each daily story's new words are added automatically, with their pictures.
- **Nam–Bắc** dictionary of Southern vs Northern words, and a *“Which one is Saigon?”* game.
- **Pronunciation guide** (*Phát âm Sài Gòn*): every Saigon sound rule with examples, plus *record yourself and compare*.
- **Library** of every story for free reading, plus XP, streaks, a 7-day calendar, a reading-level chart and history.

## How the daily difficulty adapts

You have a reading level between 1.0 and 5.99, and today's story comes from the whole-number level. Each finished daily story is scored as follows:

| Signal | Points |
|---|---|
| Comprehension score | ≥90% **+2** · ≥70% **+1** · ≥50% 0 · <50% **−2** |
| Your rating | easy **+1** · just right 0 · too hard **−2** |
| Look-ups (words tapped + translations revealed) | ≤0.3 per sentence **+1** · ≥1.5 per sentence **−1** |

The next day, your level moves by `points × 0.25`, capped at one level either way. In practice:
- A perfect, easy day with few look-ups moves you up a level.
- A hard day moves you down.
- An okay day nudges you toward the next level.

There are two safeguards:
- **Easing back:** after 3+ days away you drop back half a level.
- **Retry damping:** moving back into a level you struggled with in the past week takes twice the evidence, so you aren't bounced into it every other day.

You can also swap today's story for an easier or harder one before you start, or set your level in *Tui*. Stories you've read aren't repeated until every story at your level is used up; at that point the nearest level's unread stories come first.

All of this lives in `js/adaptive.js` (pure functions, unit-tested) and `js/daily.js`.

## Southern pronunciation

Device text-to-speech voices are usually Northern, so the app plays the best audio available:

1. **🎙️ A native speaker's recording** made on this device in the **Studio** (*Tui → Recording studio*)
2. **🌴 Shipped Southern audio** listed in `audio/manifest.json`
3. **🤖 The device's Vietnamese voice** as a fallback

The word sheet shows which source played. Every word also gets **rule-based Saigon sound tips** (`js/phonetics.js`), such as v/d/gi → “y”, -anh → -ăn, final -n → -ng, -t → -c, iê/ươ/uô flattening, and ngã pronounced like hỏi.

### Option A: record a native speaker (best quality)

Ask a Saigonese friend or tutor to open **Tui → 🎙️ Recording studio** on their phone. They pick a story, tap 🎙️ for each sentence and word, then **Export (.zip)**. Unzip the export into this folder, so the files land in `audio/`, and run:

```bash
npm run audio:manifest
```

Commit `audio/` and every learner gets the recordings. Native recordings always win over generated audio.

### Option B: generate audio with a Southern neural voice

`tools/generate-audio.js` uses [FPT.AI Text-to-Speech](https://fpt.ai), whose `lannhi` voice is documented as a Southern female voice. Get an API key at console.fpt.ai.

**From GitHub, with nothing to install:** this is the easiest way.

1. Add the key as a repository secret named `FPT_API_KEY`: **Settings → Secrets and variables → Actions → New repository secret**.
2. Let workflows open pull requests: **Settings → Actions → General → Workflow permissions →** tick **Allow GitHub Actions to create and approve pull requests**.
3. Go to **Actions → Generate Southern audio (Saigon Reader) → Run workflow**. Keep the limit at **20** for a first sample.
4. The workflow opens a pull request with the clips. Play a few `.mp3` files from *Files changed*.
5. If they sound right, run the workflow again with the limit blank to generate the rest (the same PR updates). Then merge, and the site redeploys with Southern audio.

The workflow only appears in the Actions tab once it's on the default branch (`master`).

**From your laptop:**

```bash
npm run audio -- --dry-run          # how many clips and characters (≈ cost)
FPT_API_KEY=xxxx npm run audio      # generate every missing clip
FPT_API_KEY=xxxx npm run audio -- --voice=lannhi --speed=-1 --limit=50
```

Clips are saved as `audio/<key>.mp3`. Re-runs skip anything that already exists, including native recordings. The script covers every sentence, glossary word, keyword, picture label, quiz answer and pronunciation example (about 1,900 clips and 32,000 characters for the current 25 stories). Listen to a sample and have a native speaker review it before committing everything.

Other providers with Southern voices (for example Viettel AI) can be added to `tools/generate-audio.js` in the same way.

## Run it locally

```bash
cd saigon-reader
npm run serve        # python3 -m http.server 8000 → http://localhost:8000
npm test             # unit tests + content checks
```

ES modules and the service worker need a web server; opening `index.html` directly from disk won't work.

## Put it on your iPhone / desktop

1. **Host it.** `.github/workflows/saigon-reader-pages.yml` tests and publishes this folder to GitHub Pages on every push to `master`. Turn it on once: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Any static host also works (Netlify, Vercel, Cloudflare Pages).
2. **Install it:**
   - **iPhone / iPad:** open the URL in **Safari** → **Share** → **Add to Home Screen**.
   - **Android:** Chrome → **⋮ → Install app**.
   - **Windows / Mac / Linux (Chrome or Edge):** the install icon in the address bar.
   - **Mac (Safari 17+):** **File → Add to Dock**.

For an App Store listing, wrap this folder with [Capacitor](https://capacitorjs.com/) (iOS/Android; needs a Mac and an Apple Developer account) or [Tauri](https://tauri.app/) (desktop).

## Writing stories

Stories live in `js/data/stories/level1.js` … `level5.js`, plus the first seven in `original.js`. Each story has:

- `pages`: each page has a `scene` and `sentences` as `[vietnamese, english]` pairs. A scene looks like `{ bg, time?, weather?, decor?, items: [[emoji, word]] }`. Backdrops: `street alley cafe market home kitchen park river city church rooftop metro school bus`. Decor: `rain lanterns flood mai boats`.
- `keywords`: `[word, emoji]` pairs taught before reading (at least 4).
- `quiz`: multiple choice `{ q, qEn, options, answer }` or true/false `{ tf, tfEn, answer: true|false }`.
- `vocab`: story-specific glossary entries (names, places).

Shared glossary entries are in `js/data/dictionary.js` and `dictionary-more.js`. Give an entry a `north` field to mark it as Southern. Words are matched longest-first, so add multi-word phrases whenever a phrase means more than its parts.

`npm run check` reports any word, keyword or picture label missing from the glossary, as well as broken quizzes. When you change app files, bump `VERSION` in `sw.js` so installed apps update promptly.

## Notes

- Progress is stored on the device (localStorage, plus IndexedDB for recordings). There's no account and no server.
- The Vietnamese text was written for learners in colloquial Saigon style. A native-speaker review is always welcome.
