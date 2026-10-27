import { STORIES, LEVELS } from "./data/stories.js";
import { DICTIONARY } from "./data/dictionary.js";
import { segment, makeLookup } from "./segment.js";
import { state, save, onChange, addXP, levelInfo, liveStreak, reset } from "./store.js";
import { addCard, removeCard, dueCards, review } from "./srs.js";
import { speak, stop, hasVoice, vietnameseVoices } from "./speech.js";

const $view = document.getElementById("view");
const $sheetRoot = document.getElementById("sheet-root");
const $toast = document.getElementById("toast");

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const storyById = (id) => STORIES.find((s) => s.id === id);
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

// ── Feedback helpers ────────────────────────────────────────────────
let toastTimer;
function toast(msg) {
  $toast.textContent = msg;
  $toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $toast.classList.remove("show"), 2200);
}

function confetti(n = 40) {
  const bits = ["🎉", "🧧", "⭐", "🌼", "🥖", "☕", "🛵", "🥭"];
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span");
    el.className = "confetti";
    el.textContent = bits[i % bits.length];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDelay = Math.random() * 0.4 + "s";
    el.style.animationDuration = 1.6 + Math.random() * 1.2 + "s";
    el.style.setProperty("--drift", (Math.random() * 2 - 1) * 30 + "vw");
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

function gainXP(amount, label) {
  const levelled = addXP(amount);
  toast(`+${amount} XP${label ? " · " + label : ""}`);
  if (levelled) {
    const lv = levelInfo();
    setTimeout(() => { confetti(60); toast(`Lên cấp ${lv.level}! ${lv.title} 🎉`); }, 900);
  }
}

let warnedNoVoice = false;
async function say(text, opts) {
  if (!hasVoice() && !warnedNoVoice) {
    warnedNoVoice = true;
    toast("No Vietnamese voice found. Add one in your device's speech settings.");
  }
  return speak(text, opts);
}

function applySettings() {
  const s = state.settings;
  document.documentElement.style.setProperty("--font-scale", s.fontScale);
  if (s.theme === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", s.theme);
  const due = dueCards().length;
  const badge = document.getElementById("due-badge");
  badge.hidden = !due;
  badge.textContent = due > 99 ? "99+" : due;
}
onChange(applySettings);

// ── Word sheet ──────────────────────────────────────────────────────
function openWordSheet(word, entry, storyId) {
  const key = entry?.key || word.toLowerCase();
  const saved = !!state.cards[key];
  $sheetRoot.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <div class="sheet" role="dialog" aria-label="${esc(word)}">
      <div class="sheet-grip"></div>
      <div class="sheet-head">
        <h2 class="vi">${esc(entry?.key || word)}</h2>
        <button class="icon-btn big" data-say aria-label="Listen">🔊</button>
      </div>
      ${entry ? `<p class="meaning">${esc(entry.en)}</p>` : `<p class="meaning muted">Not in the glossary yet.</p>`}
      ${entry?.north ? `<div class="dialect-chip"><span>🌴 Miền Nam</span><span class="vs">Bắc nói: <b>${esc(entry.north)}</b></span></div>` : ""}
      ${entry?.note ? `<p class="note">💡 ${esc(entry.note)}</p>` : ""}
      ${entry ? `<button class="btn ${saved ? "ghost" : "primary"} wide" data-save>${saved ? "✓ In your flashcards (tap to remove)" : "⭐ Add to flashcards"}</button>` : ""}
    </div>`;
  const sheet = $sheetRoot.querySelector(".sheet");
  requestAnimationFrame(() => $sheetRoot.classList.add("open"));
  say(entry?.key || word);
  sheet.querySelector("[data-say]").onclick = () => say(entry?.key || word);
  const saveBtn = sheet.querySelector("[data-save]");
  if (saveBtn) saveBtn.onclick = () => {
    if (state.cards[key]) { removeCard(key); toast("Removed from flashcards"); }
    else { addCard(key, { ...entry, display: key }, storyId); gainXP(2, "word saved"); }
    closeSheet();
    markSavedWords();
  };
  $sheetRoot.querySelector("[data-close]").onclick = closeSheet;
}

function closeSheet() {
  $sheetRoot.classList.remove("open");
  setTimeout(() => { if (!$sheetRoot.classList.contains("open")) $sheetRoot.innerHTML = ""; }, 250);
}

function markSavedWords() {
  document.querySelectorAll(".w[data-key]").forEach((el) => el.classList.toggle("saved", !!state.cards[el.dataset.key]));
}

// ── Home ────────────────────────────────────────────────────────────
function viewHome() {
  const lv = levelInfo();
  const streak = liveStreak();
  const doneCount = STORIES.filter((s) => state.progress[s.id]?.done).length;
  const next = STORIES.find((s) => !state.progress[s.id]?.done) || STORIES[0];
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  const byLevel = Object.entries(LEVELS).map(([n, info]) => {
    const stories = STORIES.filter((s) => s.level === Number(n));
    return `
      <section class="level-group">
        <h3><span class="lvl-dot" style="background:${info.color}"></span>Cấp ${n} · ${esc(info.name)} <small>${esc(info.en)}</small></h3>
        <div class="cards">${stories.map(storyCard).join("")}</div>
      </section>`;
  }).join("");

  $view.innerHTML = `
    <header class="hero">
      <div class="hero-top">
        <div>
          <p class="eyebrow">${greet}! 👋</p>
          <h1>Saigon Reader</h1>
          <p class="sub">Stories in Southern Vietnamese</p>
        </div>
        <div class="streak" title="Daily streak">🔥<b>${streak}</b></div>
      </div>
      <div class="xp">
        <div class="xp-label"><span>Cấp ${lv.level} · ${esc(lv.title)}</span><span>${lv.into}/${lv.per} XP</span></div>
        <div class="bar"><i style="width:${(lv.into / lv.per) * 100}%"></i></div>
      </div>
      <a class="continue" href="#/story/${next.id}">
        <span class="c-emoji">${next.emoji}</span>
        <span><small>${state.progress[next.id]?.page ? "Keep reading" : doneCount ? "Up next" : "Start here"}</small><b>${esc(next.title)}</b></span>
        <span class="arrow">→</span>
      </a>
    </header>
    ${byLevel}
    <p class="footer-note">${doneCount}/${STORIES.length} stories finished · Tap any word while reading to see what it means</p>`;
}

function storyCard(s) {
  const p = state.progress[s.id] || {};
  const stars = p.quizBest == null ? "" : "★".repeat(starsFor(p.quizBest, s.quiz.length)).padEnd(3, "☆");
  const pct = p.done ? 100 : Math.round(((p.page || 0) / s.pages.length) * 100);
  return `
    <a class="story-card" href="#/story/${s.id}" style="--accent:${s.color}">
      <div class="sc-emoji">${s.emoji}</div>
      <div class="sc-body">
        <h4>${esc(s.title)}</h4>
        <p class="sc-en">${esc(s.titleEn)} · <span>📍 ${esc(s.place)}</span></p>
        <p class="sc-sum">${esc(s.summary)}</p>
        <div class="sc-meta">
          <div class="bar thin"><i style="width:${pct}%"></i></div>
          <span class="stars">${p.done ? stars || "✓" : ""}</span>
        </div>
      </div>
    </a>`;
}

const starsFor = (score, total) => (score >= total ? 3 : score >= total - 1 ? 2 : score > 0 ? 1 : 0);

// ── Reader ──────────────────────────────────────────────────────────
let readerAbort = null;

function viewStory(id, pageParam) {
  const story = storyById(id);
  if (!story) return (location.hash = "#/");
  const prog = (state.progress[id] ||= { page: 0, done: false, quizBest: null });
  let page = pageParam != null ? Number(pageParam) : prog.done ? 0 : prog.page || 0;
  page = Math.max(0, Math.min(page, story.pages.length - 1));
  const lookup = makeLookup(DICTIONARY, story.vocab);
  const pg = story.pages[page];
  const s = state.settings;

  const sentences = pg.sentences.map(([vi, en], si) => {
    const words = segment(vi, lookup).map((t, wi) => {
      if (t.type === "gap") return esc(t.text);
      const south = t.entry?.north ? " south" : "";
      return `<span class="w${south}${t.entry ? "" : " unknown"}" role="button" tabindex="0" data-s="${si}" data-wi="${wi}" ${t.entry ? `data-key="${esc(t.entry.key)}"` : ""}>${esc(t.text)}</span>`;
    }).join("");
    return `
      <div class="sentence" data-s="${si}">
        <p class="vi-line">${words}</p>
        <p class="en-line" ${s.alwaysTranslate ? "" : "hidden"}>${esc(en)}</p>
        <div class="s-tools">
          <button class="chip" data-play="${si}" aria-label="Listen to sentence">🔊</button>
          <button class="chip" data-tr="${si}">EN</button>
        </div>
      </div>`;
  }).join("");

  const isLast = page === story.pages.length - 1;
  $view.innerHTML = `
    <div class="reader ${s.highlightSouth ? "hl-south" : ""}" style="--accent:${story.color}">
      <header class="reader-top">
        <a class="icon-btn" href="#/" aria-label="Back">←</a>
        <div class="rt-title"><b>${esc(story.title)}</b><small>${esc(story.titleEn)}</small></div>
        <button class="icon-btn" data-playall aria-label="Read page aloud">▶️</button>
      </header>
      <div class="dots">${story.pages.map((_, i) => `<i class="${i < page ? "past" : i === page ? "now" : ""}"></i>`).join("")}</div>
      <div class="scene">${pg.scene}</div>
      <article class="page">${sentences}</article>
      ${isLast ? `<aside class="culture"><h4>🇻🇳 Saigon notes</h4><p>${esc(story.culture)}</p></aside>` : ""}
      <p class="legend">${s.highlightSouth ? `<span class="w south demo">dotted</span> = Southern word · ` : ""}tap any word</p>
      <footer class="pager">
        <button class="btn ghost" data-prev ${page === 0 ? "disabled" : ""}>← Trước</button>
        <span class="pg-num">${page + 1} / ${story.pages.length}</span>
        ${isLast ? `<button class="btn primary" data-finish>Xong! Quiz →</button>` : `<button class="btn primary" data-next>Tiếp →</button>`}
      </footer>
    </div>`;

  // Cache segmentation so taps can find the entry.
  const segs = pg.sentences.map(([vi]) => segment(vi, lookup));
  markSavedWords();

  const tapWord = (el) => {
    const t = segs[el.dataset.s][el.dataset.wi];
    openWordSheet(t.text, t.entry, story.id);
  };
  $view.querySelectorAll(".w[data-s]").forEach((el) => {
    el.onclick = () => tapWord(el);
    el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tapWord(el); } };
  });
  $view.querySelectorAll("[data-play]").forEach((b) => (b.onclick = () => playSentences([Number(b.dataset.play)])));
  $view.querySelectorAll("[data-tr]").forEach((b) => (b.onclick = () => {
    const line = $view.querySelector(`.sentence[data-s="${b.dataset.tr}"] .en-line`);
    line.hidden = !line.hidden;
  }));
  $view.querySelector("[data-playall]").onclick = () => playSentences(pg.sentences.map((_, i) => i));

  async function playSentences(list) {
    stop();
    const token = (readerAbort = {});
    for (const i of list) {
      if (readerAbort !== token) return;
      const el = $view.querySelector(`.sentence[data-s="${i}"]`);
      el?.classList.add("speaking");
      await say(pg.sentences[i][0]);
      el?.classList.remove("speaking");
    }
  }

  const go = (p) => { stop(); readerAbort = null; location.hash = `#/story/${id}/${p}`; };
  const prev = $view.querySelector("[data-prev]");
  if (prev) prev.onclick = () => go(page - 1);
  const next = $view.querySelector("[data-next]");
  if (next) next.onclick = () => {
    if (!prog.done && page + 1 > (prog.page || 0)) { prog.page = page + 1; gainXP(5, "page read"); }
    go(page + 1);
  };
  const finish = $view.querySelector("[data-finish]");
  if (finish) finish.onclick = () => {
    stop();
    if (!prog.done) { prog.done = true; prog.page = 0; gainXP(20, "story finished"); }
    else save();
    location.hash = `#/quiz/${id}`;
  };

  // Swipe between pages on touch devices.
  let sx = null;
  const reader = $view.querySelector(".reader");
  reader.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  reader.addEventListener("touchend", (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx;
    sx = null;
    if (Math.abs(dx) < 70) return;
    if (dx < 0) (next || finish)?.click();
    else prev && !prev.disabled && prev.click();
  });
}

// ── Quiz ────────────────────────────────────────────────────────────
function viewQuiz(id) {
  const story = storyById(id);
  if (!story) return (location.hash = "#/");
  const questions = story.quiz.map((q) => ({ ...q, order: shuffle(q.options.map((_, i) => i)) }));
  let qi = 0;
  let score = 0;

  const renderQ = () => {
    const q = questions[qi];
    $view.innerHTML = `
      <div class="quiz" style="--accent:${story.color}">
        <header class="reader-top">
          <a class="icon-btn" href="#/story/${id}" aria-label="Back to story">←</a>
          <div class="rt-title"><b>Quiz · ${esc(story.title)}</b><small>Câu ${qi + 1} / ${questions.length}</small></div>
          <span class="icon-btn">${story.emoji}</span>
        </header>
        <div class="bar quiz-bar"><i style="width:${(qi / questions.length) * 100}%"></i></div>
        <h2 class="q">${esc(q.q)} <button class="icon-btn" data-sayq aria-label="Listen">🔊</button></h2>
        <p class="q-en">${esc(q.qEn)}</p>
        <div class="options">${q.order.map((oi) => `<button class="option" data-o="${oi}">${esc(q.options[oi])}</button>`).join("")}</div>
      </div>`;
    $view.querySelector("[data-sayq]").onclick = () => say(q.q);
    $view.querySelectorAll(".option").forEach((b) => (b.onclick = () => {
      const chosen = Number(b.dataset.o);
      const right = chosen === q.answer;
      $view.querySelectorAll(".option").forEach((o) => {
        o.disabled = true;
        if (Number(o.dataset.o) === q.answer) o.classList.add("right");
      });
      if (!right) { b.classList.add("wrong"); navigator.vibrate?.(80); }
      else { score++; gainXP(10, "đúng rồi!"); }
      say(q.options[q.answer]);
      setTimeout(() => { qi++; qi < questions.length ? renderQ() : renderEnd(); }, right ? 900 : 1600);
    }));
  };

  const renderEnd = () => {
    const prog = (state.progress[id] ||= { page: 0, done: true, quizBest: null });
    prog.quizBest = Math.max(prog.quizBest ?? 0, score);
    save();
    const stars = starsFor(score, questions.length);
    if (stars === 3) confetti();
    const cheers = ["Cố lên! (Keep going!)", "Được rồi! (Not bad!)", "Giỏi quá! (Great job!)", "Hết sẩy! (Awesome!)"];
    const nextStory = STORIES[STORIES.indexOf(story) + 1];
    $view.innerHTML = `
      <div class="quiz-end" style="--accent:${story.color}">
        <div class="big-emoji">${stars === 3 ? "🏆" : stars === 2 ? "🎉" : "💪"}</div>
        <h2>${cheers[stars]}</h2>
        <p class="score">${score} / ${questions.length}</p>
        <p class="stars big">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</p>
        <div class="end-actions">
          ${nextStory ? `<a class="btn primary wide" href="#/story/${nextStory.id}">Next story: ${esc(nextStory.title)} →</a>` : ""}
          <button class="btn ghost wide" data-retry>Try the quiz again</button>
          <a class="btn ghost wide" href="#/review">Review your words 🃏</a>
          <a class="btn ghost wide" href="#/">Back to stories</a>
        </div>
      </div>`;
    $view.querySelector("[data-retry]").onclick = () => viewQuiz(id);
  };
  renderQ();
}

// ── Flashcard review ───────────────────────────────────────────────
function viewReview() {
  const due = dueCards();
  const total = Object.keys(state.cards).length;
  if (!due.length) {
    $view.innerHTML = `
      <div class="page-head"><h1>Ôn tập</h1><p class="sub">Flashcards with spaced repetition</p></div>
      <div class="empty">
        <div class="big-emoji">${total ? "😎" : "🃏"}</div>
        <h2>${total ? "Hết bài rồi! All caught up." : "No flashcards yet"}</h2>
        <p>${total ? `You have ${total} word${total > 1 ? "s" : ""} saved. Come back later for the next review.` : "While reading, tap a word and press ⭐ to save it here."}</p>
        <a class="btn primary" href="#/">Read a story</a>
      </div>
      ${total ? wordList() : ""}`;
    bindWordList();
    return;
  }
  let reviewed = 0;
  const show = () => {
    const list = dueCards();
    if (!list.length) { gainXP(reviewed * 2, `${reviewed} card${reviewed > 1 ? "s" : ""} reviewed`); confetti(25); return viewReview(); }
    const [key, c] = list[0];
    $view.innerHTML = `
      <div class="page-head"><h1>Ôn tập</h1><p class="sub">${list.length} card${list.length > 1 ? "s" : ""} due</p></div>
      <div class="flash" tabindex="0" role="button" aria-label="Flip card">
        <div class="flash-inner">
          <div class="face front">
            <p class="fc-vi">${esc(c.vi)}</p>
            <p class="hint">Tap to flip</p>
          </div>
          <div class="face back">
            <p class="fc-vi small">${esc(c.vi)}</p>
            <p class="fc-en">${esc(c.en)}</p>
            ${c.north ? `<div class="dialect-chip"><span>🌴 Nam</span><span class="vs">Bắc: <b>${esc(c.north)}</b></span></div>` : ""}
            ${c.note ? `<p class="note">💡 ${esc(c.note)}</p>` : ""}
          </div>
        </div>
      </div>
      <div class="fc-actions">
        <button class="icon-btn big" data-say aria-label="Listen">🔊</button>
      </div>
      <div class="grades" hidden>
        <button class="btn grade again" data-g="0">Quên rồi<small>Again</small></button>
        <button class="btn grade good" data-g="1">Nhớ<small>Good</small></button>
        <button class="btn grade easy" data-g="2">Dễ ợt<small>Easy</small></button>
      </div>`;
    const flash = $view.querySelector(".flash");
    const flip = () => { flash.classList.add("flipped"); $view.querySelector(".grades").hidden = false; };
    flash.onclick = flip;
    flash.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } };
    $view.querySelector("[data-say]").onclick = () => say(c.vi);
    say(c.vi);
    $view.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => { review(key, Number(b.dataset.g)); reviewed++; show(); }));
  };
  show();
}

function wordList() {
  const items = Object.entries(state.cards).sort((a, b) => b[1].added - a[1].added);
  return `
    <section class="wordlist">
      <h3>Your words (${items.length})</h3>
      ${items.map(([k, c]) => `
        <div class="wl-row">
          <button class="icon-btn" data-sayw="${esc(c.vi)}" aria-label="Listen">🔊</button>
          <div><b>${esc(c.vi)}</b><span>${esc(c.en)}</span></div>
          <span class="box" title="Memory strength">${"●".repeat(Math.min(c.box, 5))}${"○".repeat(Math.max(0, 5 - c.box))}</span>
          <button class="icon-btn" data-del="${esc(k)}" aria-label="Remove">✕</button>
        </div>`).join("")}
    </section>`;
}

function bindWordList() {
  $view.querySelectorAll("[data-sayw]").forEach((b) => (b.onclick = () => say(b.dataset.sayw)));
  $view.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => { removeCard(b.dataset.del); viewReview(); }));
}

// ── Nam vs Bắc ─────────────────────────────────────────────────────
function southernEntries() {
  const map = new Map();
  for (const [k, v] of Object.entries(DICTIONARY)) if (v.north) map.set(k, v);
  for (const s of STORIES) for (const [k, v] of Object.entries(s.vocab || {})) if (v.north && !map.has(k)) map.set(k, v);
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "vi"));
}

function viewDialect() {
  const entries = southernEntries();
  $view.innerHTML = `
    <div class="page-head">
      <h1>Nam – Bắc</h1>
      <p class="sub">Saigon words vs. Hà Nội words. Learn the Southern ones!</p>
    </div>
    <button class="btn primary wide" data-game>🎮 Play “Which one is Saigon?”</button>
    <input class="search" type="search" placeholder="Search… (e.g. pineapple, ly, mắc)" aria-label="Search">
    <div class="dialect-table">
      <div class="dt-head"><span>🌴 Nam</span><span>🏯 Bắc</span><span>English</span></div>
      ${entries.map(([k, v]) => `
        <button class="dt-row" data-say="${esc(k)}" data-search="${esc((k + " " + v.north + " " + v.en).toLowerCase())}">
          <b>${esc(k)}</b><span>${esc(v.north)}</span><small>${esc(v.en)}</small>
        </button>`).join("")}
    </div>`;
  $view.querySelectorAll("[data-say]").forEach((b) => (b.onclick = () => say(b.dataset.say)));
  $view.querySelector(".search").oninput = (e) => {
    const q = e.target.value.trim().toLowerCase();
    $view.querySelectorAll(".dt-row").forEach((r) => (r.hidden = q && !r.dataset.search.includes(q)));
  };
  $view.querySelector("[data-game]").onclick = () => dialectGame(entries);
}

function dialectGame(entries) {
  // Only pairs where the northern word is a single clean alternative.
  const pool = shuffle(entries.filter(([, v]) => !/[()]/.test(v.north))).slice(0, 8);
  let i = 0;
  let score = 0;
  const round = () => {
    if (i >= pool.length) {
      if (score === pool.length) confetti();
      gainXP(score * 3, "Nam–Bắc");
      $view.innerHTML = `
        <div class="quiz-end">
          <div class="big-emoji">${score >= pool.length - 1 ? "🌴" : "🛵"}</div>
          <h2>${score} / ${pool.length}</h2>
          <p>${score >= pool.length - 1 ? "Nói giọng Sài Gòn ngon lành! You sound like a local." : "Practice makes perfect. Thử lại nha!"}</p>
          <div class="end-actions">
            <button class="btn primary wide" data-again>Play again</button>
            <a class="btn ghost wide" href="#/dialect">Back to the list</a>
          </div>
        </div>`;
      $view.querySelector("[data-again]").onclick = () => dialectGame(entries);
      return;
    }
    const [south, v] = pool[i];
    const opts = shuffle([{ t: south, ok: true }, { t: v.north, ok: false }]);
    $view.innerHTML = `
      <div class="quiz">
        <header class="reader-top">
          <a class="icon-btn" href="#/dialect" aria-label="Back">←</a>
          <div class="rt-title"><b>Which one is Saigon?</b><small>${i + 1} / ${pool.length}</small></div>
          <span class="icon-btn">🌴</span>
        </header>
        <div class="bar quiz-bar"><i style="width:${(i / pool.length) * 100}%"></i></div>
        <p class="q-en">How would a Saigonese say…</p>
        <h2 class="q">“${esc(v.en)}”</h2>
        <div class="options two">${opts.map((o, k) => `<button class="option" data-k="${k}">${esc(o.t)}</button>`).join("")}</div>
      </div>`;
    $view.querySelectorAll(".option").forEach((b) => (b.onclick = () => {
      const o = opts[b.dataset.k];
      $view.querySelectorAll(".option").forEach((x) => { x.disabled = true; if (opts[x.dataset.k].ok) x.classList.add("right"); });
      if (o.ok) score++; else b.classList.add("wrong");
      say(south);
      setTimeout(() => { i++; round(); }, o.ok ? 800 : 1500);
    }));
  };
  round();
}

// ── Profile & settings ─────────────────────────────────────────────
let deferredInstall = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstall = e; });

function viewMe() {
  const lv = levelInfo();
  const s = state.settings;
  const done = STORIES.filter((x) => state.progress[x.id]?.done).length;
  const words = Object.keys(state.cards).length;
  const voices = vietnameseVoices();
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  $view.innerHTML = `
    <div class="page-head"><h1>Tui</h1><p class="sub">Your progress & settings</p></div>
    <div class="profile">
      <div class="avatar">🧑‍🎓</div>
      <div><b>Cấp ${lv.level} · ${esc(lv.title)}</b><small>${esc(lv.titleEn)}</small>
        <div class="bar"><i style="width:${(lv.into / lv.per) * 100}%"></i></div></div>
    </div>
    <div class="stats">
      <div><b>${state.xp}</b><span>XP</span></div>
      <div><b>🔥 ${liveStreak()}</b><span>day streak</span></div>
      <div><b>${done}/${STORIES.length}</b><span>stories</span></div>
      <div><b>${words}</b><span>words</span></div>
    </div>

    ${standalone ? "" : `
    <section class="panel install">
      <h3>📲 Install the app</h3>
      ${ios
        ? `<p>On iPhone/iPad in <b>Safari</b>: tap <b>Share</b> <span class="kbd">⎋</span> then <b>Add to Home Screen</b>. It opens full-screen and works offline.</p>`
        : `<p>Install Saigon Reader as an app on this device. It works offline.</p>
           <button class="btn primary" data-install>Install</button>
           <p class="muted small">No button response? In Chrome/Edge use the install icon in the address bar. In Safari on Mac use <b>File → Add to Dock</b>.</p>`}
    </section>`}

    <section class="panel">
      <h3>⚙️ Settings</h3>
      <label class="row">Speech speed <span class="val">${s.rate.toFixed(2)}×</span>
        <input type="range" min="0.5" max="1.2" step="0.05" value="${s.rate}" data-set="rate"></label>
      <label class="row">Voice
        <select data-set="voiceURI">
          ${voices.length ? voices.map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.voiceURI ? "selected" : ""}>${esc(v.name)}</option>`).join("") : `<option>No Vietnamese voice installed</option>`}
        </select></label>
      <label class="row">Text size
        <input type="range" min="0.85" max="1.5" step="0.05" value="${s.fontScale}" data-set="fontScale"></label>
      <label class="row toggle">Always show English <input type="checkbox" data-set="alwaysTranslate" ${s.alwaysTranslate ? "checked" : ""}></label>
      <label class="row toggle">Underline Southern words <input type="checkbox" data-set="highlightSouth" ${s.highlightSouth ? "checked" : ""}></label>
      <label class="row">Theme
        <select data-set="theme">
          ${["auto", "light", "dark"].map((t) => `<option value="${t}" ${s.theme === t ? "selected" : ""}>${t[0].toUpperCase() + t.slice(1)}</option>`).join("")}
        </select></label>
      <button class="btn ghost" data-test>🔊 Test voice</button>
      <p class="muted small">Audio uses your device's Vietnamese voice. Most voices have a Northern accent, so check the 💡 notes for Saigon pronunciation.</p>
    </section>
    <section class="panel">
      <button class="btn danger" data-reset>Reset all progress</button>
    </section>`;

  $view.querySelectorAll("[data-set]").forEach((el) => {
    el.onchange = el.oninput = () => {
      const k = el.dataset.set;
      state.settings[k] = el.type === "checkbox" ? el.checked : el.type === "range" ? Number(el.value) : el.value;
      save();
      if (k === "rate") el.parentElement.querySelector(".val").textContent = Number(el.value).toFixed(2) + "×";
    };
  });
  $view.querySelector("[data-test]").onclick = () => say("Chào bạn! Hôm nay đi uống cà phê sữa đá hông?");
  $view.querySelector("[data-reset]").onclick = () => { if (confirm("Reset all progress, XP and flashcards?")) { reset(); viewMe(); toast("Progress reset"); } };
  const ib = $view.querySelector("[data-install]");
  if (ib) ib.onclick = async () => {
    if (!deferredInstall) return toast("Use your browser's install option (see below)");
    deferredInstall.prompt();
    await deferredInstall.userChoice;
    deferredInstall = null;
  };
}

// ── Router ─────────────────────────────────────────────────────────
function route() {
  stop();
  closeSheet();
  const [, name, a, b] = location.hash.replace(/^#/, "").split("/");
  const tab = { "": "home", story: "home", quiz: "home", review: "review", dialect: "dialect", me: "me" }[name || ""] || "home";
  document.querySelectorAll(".tabbar a").forEach((el) => el.classList.toggle("active", el.dataset.tab === tab));
  document.body.dataset.view = name || "home";
  if (name === "story") viewStory(a, b);
  else if (name === "quiz") viewQuiz(a);
  else if (name === "review") viewReview();
  else if (name === "dialect") viewDialect();
  else if (name === "me") viewMe();
  else viewHome();
  window.scrollTo(0, 0);
  $view.focus({ preventScroll: true });
}

window.addEventListener("hashchange", route);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSheet();
  if (document.body.dataset.view === "story" && !$sheetRoot.innerHTML) {
    if (e.key === "ArrowRight") ($view.querySelector("[data-next]") || $view.querySelector("[data-finish]"))?.click();
    if (e.key === "ArrowLeft") { const p = $view.querySelector("[data-prev]"); if (p && !p.disabled) p.click(); }
  }
});

applySettings();
route();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
