import { STORIES, LEVELS } from "../data/stories.js";
import { state, levelInfo, liveStreak, dateStr } from "../store.js";
import { ensureDaily } from "../daily.js";
import { levelOf } from "../adaptive.js";
import { dueCards } from "../srs.js";
import { $view, esc } from "../ui.js";
import { starsFor } from "./quiz.js";

export function viewHome() {
  const d = ensureDaily();
  const story = STORIES.find((s) => s.id === d.storyId);
  const lv = levelInfo();
  const streak = liveStreak();
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  const due = dueCards().length;
  const readLevel = levelOf(state.skill);
  const into = Math.round((state.skill - readLevel) * 100);

  // Last 7 days: done / missed.
  const doneDates = new Set(state.history.map((h) => h.date));
  const week = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(Date.now() - (6 - i) * 864e5);
    const ds = dateStr(dt);
    return { ds, label: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][dt.getDay()], done: doneDates.has(ds), today: i === 6 };
  });

  $view.innerHTML = `
    <header class="hero">
      <div class="hero-top">
        <div>
          <p class="eyebrow">${greet}! 👋</p>
          <h1>Saigon Reader</h1>
          <p class="sub">Daily stories in Southern Vietnamese</p>
        </div>
        <div class="streak" title="Daily streak">🔥<b>${streak}</b></div>
      </div>
      <div class="week">${week.map((w) => `<span class="${w.done ? "done" : ""} ${w.today ? "today" : ""}"><i>${w.done ? "✓" : ""}</i>${w.label}</span>`).join("")}</div>
      <div class="xp">
        <div class="xp-label"><span>📈 Reading level: Cấp ${readLevel} · ${esc(LEVELS[readLevel].name)}</span><span>${readLevel < 5 ? into + "%" : "max"}</span></div>
        <div class="bar"><i style="width:${readLevel < 5 ? into : 100}%"></i></div>
      </div>
    </header>

    <a class="today-card ${d.done ? "is-done" : ""}" href="#/today" style="--accent:${story.color}">
      <div class="tc-top"><span class="tc-badge">${d.done ? "✓ Đã đọc hôm nay" : "📅 Truyện hôm nay"}</span><span class="tc-level">Cấp ${story.level}</span></div>
      <div class="tc-body">
        <span class="tc-emoji">${story.emoji}</span>
        <div><h2>${esc(story.title)}</h2><p>${esc(story.titleEn)} · 📍 ${esc(story.place)}</p></div>
      </div>
      <p class="tc-reason">${d.reason.dir > 0 ? "⬆️" : d.reason.dir < 0 ? "⬇️" : "➡️"} ${esc(d.reason.vi)}</p>
      <span class="btn primary wide">${d.done ? "See today's results" : d.step === "vocab" ? "Bắt đầu · Start" : "Tiếp tục · Continue"} →</span>
    </a>

    <div class="quick">
      <a href="#/review" class="quick-tile"><span>🃏</span><b>${due}</b><small>cards due</small></a>
      <a href="#/sounds" class="quick-tile"><span>🗣️</span><b>Phát âm</b><small>Saigon sounds</small></a>
      <a href="#/library" class="quick-tile"><span>📚</span><b>${STORIES.filter((s) => state.progress[s.id]?.done).length}/${STORIES.length}</b><small>stories read</small></a>
    </div>

    <section class="panel xp-panel">
      <div class="xp-label"><span>⭐ Cấp ${lv.level} · ${esc(lv.title)}</span><span>${lv.into}/${lv.per} XP</span></div>
      <div class="bar"><i style="width:${(lv.into / lv.per) * 100}%"></i></div>
    </section>`;
}

export function viewLibrary() {
  const byLevel = Object.entries(LEVELS).map(([n, info]) => {
    const stories = STORIES.filter((s) => s.level === Number(n));
    return `
      <section class="level-group">
        <h3><span class="lvl-dot" style="background:${info.color}"></span>Cấp ${n} · ${esc(info.name)} <small>${esc(info.en)}</small></h3>
        <div class="cards">${stories.map(storyCard).join("")}</div>
      </section>`;
  }).join("");
  $view.innerHTML = `
    <div class="page-head"><h1>Thư viện</h1><p class="sub">All ${STORIES.length} stories. Read anything, any time. Only the daily story changes your level.</p></div>
    ${byLevel}`;
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
