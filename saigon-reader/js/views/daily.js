import { STORIES, LEVELS } from "../data/stories.js";
import { state, save, today } from "../store.js";
import { addCard } from "../srs.js";
import { ensureDaily, swapDaily, finishDaily, previewTomorrow } from "../daily.js";
import { renderScene } from "../scene.js";
import { $view, esc, say, gainXP, confetti, openWordSheet } from "../ui.js";
import { renderReader, entryFor } from "./reader.js";
import { buildQuestions, runQuiz, starsFor } from "./quiz.js";

const storyById = (id) => STORIES.find((s) => s.id === id);

export function viewToday(step, arg) {
  const d = ensureDaily();
  const story = storyById(d.storyId);
  if (d.done && step !== "done") return viewDone(d, story);
  if (!step) return viewIntro(d, story);
  if (step === "words") return viewWords(d, story);
  if (step === "read") return viewRead(d, story, Number(arg) || 0);
  if (step === "quiz") return viewDailyQuiz(d, story);
  if (step === "rate") return viewRate(d, story);
  return viewDone(d, story);
}

function setStep(d, step) {
  if (d.step !== step) { d.step = step; save(); }
}

const STEP_HREF = { vocab: "#/today/words", read: "#/today/read/0", quiz: "#/today/quiz", rate: "#/today/rate" };

function viewIntro(d, story) {
  const started = d.step !== "vocab";
  const lv = LEVELS[story.level];
  const dirIcon = d.reason.dir > 0 ? "⬆️" : d.reason.dir < 0 ? "⬇️" : "➡️";
  $view.innerHTML = `
    <div class="daily-intro" style="--accent:${story.color}">
      <header class="reader-top">
        <a class="icon-btn" href="#/" aria-label="Back">←</a>
        <div class="rt-title"><b>Truyện hôm nay</b><small>Today's story · ${formatDate(d.date)}</small></div>
        <span class="icon-btn">📅</span>
      </header>
      <div class="adapt-note dir-${d.reason.dir}">
        <span class="dir">${dirIcon}</span>
        <div><b>${esc(d.reason.vi)}</b><small>${esc(d.reason.en)}</small></div>
      </div>
      ${renderScene(story.pages[0].scene)}
      <h1 class="di-title">${story.emoji} ${esc(story.title)}</h1>
      <p class="di-sub">${esc(story.titleEn)} · 📍 ${esc(story.place)}</p>
      <p class="level-pill" style="--lvl:${lv.color}">Cấp ${story.level} · ${esc(lv.name)} <small>${esc(lv.en)}</small></p>
      <p>${esc(story.summary)}</p>
      <ol class="steps">
        <li class="${d.step === "vocab" ? "now" : "done"}">🖼️ <b>Từ mới</b> · ${story.keywords.length} new words</li>
        <li class="${d.step === "read" ? "now" : ["quiz", "rate"].includes(d.step) ? "done" : ""}">📖 <b>Đọc</b> · ${story.pages.length} pages</li>
        <li class="${d.step === "quiz" ? "now" : d.step === "rate" ? "done" : ""}">❓ <b>Câu hỏi</b> · comprehension + vocab</li>
        <li class="${d.step === "rate" ? "now" : ""}">⭐ <b>Đánh giá</b> · how hard was it?</li>
      </ol>
      <a class="btn primary wide big-cta" href="${STEP_HREF[d.step] || STEP_HREF.vocab}">${started ? "Tiếp tục →" : "Bắt đầu →"}</a>
      ${started ? "" : `
      <div class="swap">
        <button class="btn ghost" data-swap="-1" ${story.level <= 1 ? "disabled" : ""}>😅 Easier</button>
        <button class="btn ghost" data-swap="1" ${story.level >= 5 ? "disabled" : ""}>💪 Harder</button>
      </div>`}
      <p class="muted small center">Tomorrow's story adapts to how you do today: your quiz score, how many words you look up, and how hard you say it felt.</p>
    </div>`;
  $view.querySelectorAll("[data-swap]").forEach((b) => (b.onclick = () => { swapDaily(Number(b.dataset.swap)); viewIntro(state.daily, storyById(state.daily.storyId)); }));
}

function viewWords(d, story) {
  setStep(d, "vocab");
  const words = story.keywords;
  $view.innerHTML = `
    <div class="words-step" style="--accent:${story.color}">
      <header class="reader-top">
        <a class="icon-btn" href="#/today" aria-label="Back">←</a>
        <div class="rt-title"><b>Từ mới hôm nay</b><small>Tap each card to hear it and see the meaning</small></div>
        <span class="icon-btn">🖼️</span>
      </header>
      <div class="word-cards">
        ${words.map(([w, pic], i) => {
          const e = entryFor(story, w);
          return `<button class="word-card" data-i="${i}">
            <span class="wc-pic">${pic}</span>
            <span class="wc-vi">${esc(w)}</span>
            <span class="wc-en">${esc(e?.en || "")}</span>
            ${e?.north ? `<span class="wc-south">🌴 Bắc: ${esc(e.north)}</span>` : ""}
          </button>`;
        }).join("")}
      </div>
      <p class="muted small center">These words will be added to your flashcards when you finish.</p>
      <button class="btn primary wide big-cta" data-go>Đọc truyện →</button>
    </div>`;
  $view.querySelectorAll(".word-card").forEach((b) => (b.onclick = () => {
    const [w, pic] = words[b.dataset.i];
    b.classList.add("flipped");
    if (b.classList.contains("seen")) openWordSheet(w, entryFor(story, w), { storyId: story.id, pic });
    else say(w);
    b.classList.add("seen");
  }));
  $view.querySelector("[data-go]").onclick = () => { setStep(d, "read"); location.hash = "#/today/read/0"; };
}

function viewRead(d, story, page) {
  setStep(d, "read");
  renderReader(story, page, {
    mode: "daily",
    backHref: "#/today",
    pageHref: (p) => `#/today/read/${p}`,
    onLookup: (key) => { if (!d.lookups.includes(key)) { d.lookups.push(key); save(); } },
    onFinish: () => { setStep(d, "quiz"); location.hash = "#/today/quiz"; },
  });
}

function viewDailyQuiz(d, story) {
  runQuiz({
    story,
    title: `Câu hỏi · ${story.title}`,
    backHref: "#/today/read/" + (story.pages.length - 1),
    questions: buildQuestions(story, { vocab: true }),
    onDone: ({ score, total }) => {
      d.quiz = score;
      d.total = total;
      const p = (state.progress[story.id] ||= { page: 0, done: true, quizBest: null });
      p.quizBest = Math.max(p.quizBest ?? 0, score);
      setStep(d, "rate");
      location.hash = "#/today/rate";
    },
  });
}

function viewRate(d, story) {
  $view.innerHTML = `
    <div class="rate-step" style="--accent:${story.color}">
      <div class="big-emoji">🤔</div>
      <h2>Truyện hôm nay thấy sao?</h2>
      <p class="muted">How did today's story feel?</p>
      <div class="rate-options">
        <button class="rate" data-r="easy"><span>😎</span><b>Dễ ợt</b><small>Too easy</small></button>
        <button class="rate" data-r="ok"><span>🙂</span><b>Vừa</b><small>Just right</small></button>
        <button class="rate" data-r="hard"><span>🥵</span><b>Khó quá</b><small>Too hard</small></button>
      </div>
      <p class="muted small">You got ${d.quiz}/${d.total} comprehension questions and looked up ${d.lookups.length} thing${d.lookups.length === 1 ? "" : "s"}.</p>
    </div>`;
  $view.querySelectorAll("[data-r]").forEach((b) => (b.onclick = () => {
    const { result } = finishDaily({ rating: b.dataset.r });
    for (const [w, pic] of story.keywords) {
      const e = entryFor(story, w);
      if (e) addCard(e.key, { ...e, display: e.key, pic }, story.id);
    }
    gainXP(30 + result.quiz * 5, "daily story ✓");
    location.hash = "#/today/done";
  }));
}

function viewDone(d, story) {
  const r = state.history.findLast((h) => h.date === d.date) || { quiz: d.quiz, total: d.total, lookups: d.lookups.length };
  const stars = starsFor(r.quiz, r.total);
  if (stars === 3) confetti();
  const next = tomorrowLevel();
  const arrow = next.level > d.level ? "⬆️ Harder" : next.level < d.level ? "⬇️ Easier" : "➡️ Same level";
  $view.innerHTML = `
    <div class="quiz-end" style="--accent:${story.color}">
      <div class="big-emoji">${stars === 3 ? "🏆" : stars === 2 ? "🎉" : "💪"}</div>
      <h2>Xong truyện hôm nay!</h2>
      <p class="muted">Today's story is done. Hẹn mai gặp lại!</p>
      <p class="stars big">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</p>
      <div class="stats">
        <div><b>${r.quiz}/${r.total}</b><span>comprehension</span></div>
        <div><b>${r.lookups}</b><span>look-ups</span></div>
        <div><b>+${story.keywords.length}</b><span>new words</span></div>
        <div><b>🔥 ${state.streak.count}</b><span>streak</span></div>
      </div>
      <div class="tomorrow"><b>Tomorrow: Cấp ${next.level}</b> <span>${arrow}</span></div>
      <div class="end-actions">
        <a class="btn primary wide" href="#/review">Review your words 🃏</a>
        <a class="btn ghost wide" href="#/story/${story.id}">Read it again</a>
        <a class="btn ghost wide" href="#/library">Read more stories</a>
      </div>
    </div>`;
}

// Tomorrow's level, as ensureDaily() will compute it from today's result.
function tomorrowLevel() {
  const last = state.history[state.history.length - 1];
  return last?.date === today() ? previewTomorrow(last) : { level: Math.floor(state.skill) };
}

function formatDate(s) {
  const [y, m, dd] = s.split("-").map(Number);
  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  return `${days[new Date(y, m - 1, dd).getDay()]}, ${dd}/${m}`;
}
