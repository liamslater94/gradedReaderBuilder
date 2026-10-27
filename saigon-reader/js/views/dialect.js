import { STORIES } from "../data/stories.js";
import { DICTIONARY } from "../data/dictionary.js";
import { $view, esc, say, shuffle, gainXP, confetti } from "../ui.js";

function southernEntries() {
  const map = new Map();
  for (const [k, v] of Object.entries(DICTIONARY)) if (v.north) map.set(k, v);
  for (const s of STORIES) for (const [k, v] of Object.entries(s.vocab || {})) if (v.north && !map.has(k)) map.set(k, v);
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "vi"));
}

export function viewDialect() {
  const entries = southernEntries();
  $view.innerHTML = `
    <div class="page-head">
      <h1>Nam – Bắc</h1>
      <p class="sub">Saigon words vs. Hà Nội words. ${entries.length} pairs and counting.</p>
    </div>
    <a class="sounds-link" href="#/sounds"><span>🗣️</span><div><b>Saigon pronunciation guide</b><small>v → y, -anh → -ăn, ngã = hỏi… hear the difference</small></div><span>→</span></a>
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
