import { DICTIONARY } from "../data/dictionary.js";
import { segment, makeLookup } from "../segment.js";
import { state, save } from "../store.js";
import { stop } from "../audio.js";
import { renderScene } from "../scene.js";
import { $view, esc, say, gainXP, openWordSheet, markSavedWords } from "../ui.js";

export const storyLookup = (story) => makeLookup(DICTIONARY, story.vocab);

// Look a word up and return an entry carrying its key (for sheets & cards).
export function entryFor(story, word) {
  const key = word.toLowerCase();
  const e = storyLookup(story)(key);
  return e ? { key, ...e } : null;
}

let playToken = null;

// Renders one page of a story.
//   mode: "library" (free reading) or "daily" (counts look-ups, ends with the daily quiz)
export function renderReader(story, page, { mode = "library", backHref = "#/", pageHref, onFinish, onLookup }) {
  const lookup = storyLookup(story);
  page = Math.max(0, Math.min(page, story.pages.length - 1));
  const pg = story.pages[page];
  const s = state.settings;
  const segs = pg.sentences.map(([vi]) => segment(vi, lookup));

  const sentences = pg.sentences.map(([, en], si) => {
    const words = segs[si].map((t, wi) => {
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
  const finishLabel = mode === "daily" ? "Câu hỏi →" : "Xong! Quiz →";
  $view.innerHTML = `
    <div class="reader ${s.highlightSouth ? "hl-south" : ""}" style="--accent:${story.color}">
      <header class="reader-top">
        <a class="icon-btn" href="${backHref}" aria-label="Back">←</a>
        <div class="rt-title"><b>${esc(story.title)}</b><small>${mode === "daily" ? "📅 Truyện hôm nay · " : ""}Cấp ${story.level} · ${esc(story.titleEn)}</small></div>
        <button class="icon-btn" data-playall aria-label="Read page aloud">▶️</button>
      </header>
      <div class="dots">${story.pages.map((_, i) => `<i class="${i < page ? "past" : i === page ? "now" : ""}"></i>`).join("")}</div>
      ${renderScene(pg.scene)}
      <article class="page">${sentences}</article>
      ${isLast ? `<aside class="culture"><h4>🇻🇳 Saigon notes</h4><p>${esc(story.culture)}</p></aside>` : ""}
      <p class="legend">${s.highlightSouth ? `<span class="w south demo">dotted</span> = Southern word · ` : ""}tap any word or picture</p>
      <footer class="pager">
        <button class="btn ghost" data-prev ${page === 0 ? "disabled" : ""}>← Trước</button>
        <span class="pg-num">${page + 1} / ${story.pages.length}</span>
        ${isLast ? `<button class="btn primary" data-finish>${finishLabel}</button>` : `<button class="btn primary" data-next>Tiếp →</button>`}
      </footer>
    </div>`;
  markSavedWords();

  const lookedUp = (key) => onLookup?.(key);
  const tapWord = (el) => {
    const t = segs[el.dataset.s][el.dataset.wi];
    if (t.entry) lookedUp(t.entry.key);
    openWordSheet(t.text, t.entry, { storyId: story.id });
  };
  $view.querySelectorAll(".w[data-s]").forEach((el) => {
    el.onclick = () => tapWord(el);
    el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tapWord(el); } };
  });
  $view.querySelectorAll(".scene-item").forEach((b) => (b.onclick = () => {
    const word = b.dataset.word;
    openWordSheet(word, entryFor(story, word), { storyId: story.id, pic: b.querySelector(".si-pic").textContent });
  }));
  $view.querySelectorAll("[data-play]").forEach((b) => (b.onclick = () => playSentences([Number(b.dataset.play)])));
  $view.querySelectorAll("[data-tr]").forEach((b) => (b.onclick = () => {
    const line = $view.querySelector(`.sentence[data-s="${b.dataset.tr}"] .en-line`);
    line.hidden = !line.hidden;
    if (!line.hidden) lookedUp(`#translate:${page}:${b.dataset.tr}`);
  }));
  $view.querySelector("[data-playall]").onclick = () => playSentences(pg.sentences.map((_, i) => i));

  async function playSentences(list) {
    stop();
    const token = (playToken = {});
    for (const i of list) {
      if (playToken !== token) return;
      const el = $view.querySelector(`.sentence[data-s="${i}"]`);
      el?.classList.add("speaking");
      await say(pg.sentences[i][0]);
      el?.classList.remove("speaking");
    }
  }

  const go = (p) => { stop(); playToken = null; location.hash = pageHref(p); };
  const prev = $view.querySelector("[data-prev]");
  prev.onclick = () => go(page - 1);
  const next = $view.querySelector("[data-next]");
  if (next) next.onclick = () => {
    const prog = (state.progress[story.id] ||= { page: 0, done: false, quizBest: null });
    if (!prog.done && page + 1 > (prog.page || 0)) { prog.page = page + 1; gainXP(5, "page read"); }
    go(page + 1);
  };
  const finish = $view.querySelector("[data-finish]");
  if (finish) finish.onclick = () => {
    stop();
    const prog = (state.progress[story.id] ||= { page: 0, done: false, quizBest: null });
    if (!prog.done) { prog.done = true; prog.page = 0; gainXP(20, "story finished"); } else save();
    onFinish();
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
    else if (!prev.disabled) prev.click();
  });
}

export function startPage(story) {
  const prog = state.progress[story.id];
  return prog && !prog.done ? prog.page || 0 : 0;
}
