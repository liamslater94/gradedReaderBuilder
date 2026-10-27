import { $view, esc, say, shuffle, gainXP } from "../ui.js";
import { entryFor } from "./reader.js";

// Turn a story's quiz into question objects. Comprehension questions come from
// the story; with { vocab: true } picture and listening questions are added
// from the story's keywords.
export function buildQuestions(story, { vocab = false } = {}) {
  const qs = story.quiz.map((q) =>
    "tf" in q
      ? { kind: "tf", counts: true, prompt: q.tf, sub: q.tfEn ? `Đúng hay sai? · ${q.tfEn}` : "Đúng hay sai? (True or false?)", options: ["Đúng ✓", "Sai ✗"], answer: q.answer ? 0 : 1, sayText: q.tf }
      : { kind: "mc", counts: true, prompt: q.q, sub: q.qEn, options: q.options, answer: q.answer, sayText: q.q });
  const kw = story.keywords || [];
  if (vocab && kw.length >= 3) {
    for (const [word, pic] of shuffle(kw).slice(0, 2)) {
      const others = shuffle(kw.filter(([w]) => w !== word)).slice(0, 3);
      const opts = shuffle([[word, pic], ...others]);
      qs.push({ kind: "pic", prompt: `Hình nào là “${word}”?`, sub: "Which picture matches the word?", options: opts.map(([, p]) => p), answer: opts.findIndex(([w]) => w === word), sayText: word, explain: word });
    }
    const [word] = shuffle(kw)[0];
    const others = shuffle(kw.filter(([w]) => w !== word)).slice(0, 3);
    const opts = shuffle([word, ...others.map(([w]) => w)]);
    qs.push({ kind: "listen", prompt: "Nghe và chọn từ đúng", sub: "Listen and pick the word you hear", options: opts, answer: opts.indexOf(word), sayText: word, autoplay: true });
  }
  return qs;
}

// Runs a quiz. onDone({ score, total, allScore, allTotal }) gets the
// comprehension score (questions with counts: true) and the overall score.
export function runQuiz({ story, questions, title, backHref, onDone }) {
  let qi = 0;
  let score = 0;
  let allScore = 0;
  const total = questions.filter((q) => q.counts).length;

  const renderQ = () => {
    const q = questions[qi];
    const isPic = q.kind === "pic";
    $view.innerHTML = `
      <div class="quiz" style="--accent:${story.color}">
        <header class="reader-top">
          <a class="icon-btn" href="${backHref}" aria-label="Back">←</a>
          <div class="rt-title"><b>${esc(title)}</b><small>Câu ${qi + 1} / ${questions.length}</small></div>
          <span class="icon-btn">${story.emoji}</span>
        </header>
        <div class="bar quiz-bar"><i style="width:${(qi / questions.length) * 100}%"></i></div>
        <p class="q-kind">${{ mc: "📖 Hiểu truyện", tf: "📖 Đúng hay sai", pic: "🖼️ Từ vựng", listen: "👂 Nghe" }[q.kind]}</p>
        <h2 class="q">${q.kind === "listen" ? "" : esc(q.prompt)} <button class="icon-btn ${q.kind === "listen" ? "huge" : ""}" data-sayq aria-label="Listen">🔊</button></h2>
        <p class="q-en">${esc(q.kind === "listen" ? q.prompt + " · " + q.sub : q.sub || "")}</p>
        <div class="options ${isPic ? "pics" : q.options.length === 2 ? "two" : ""}">${q.options.map((o, i) => `<button class="option" data-o="${i}">${esc(o)}</button>`).join("")}</div>
        <p class="explain" hidden></p>
      </div>`;
    $view.querySelector("[data-sayq]").onclick = () => say(q.sayText);
    if (q.autoplay) setTimeout(() => say(q.sayText), 300);
    $view.querySelectorAll(".option").forEach((b) => (b.onclick = () => {
      const chosen = Number(b.dataset.o);
      const right = chosen === q.answer;
      $view.querySelectorAll(".option").forEach((o) => {
        o.disabled = true;
        if (Number(o.dataset.o) === q.answer) o.classList.add("right");
      });
      if (right) {
        allScore++;
        if (q.counts) score++;
        gainXP(q.counts ? 10 : 5, "đúng rồi!");
      } else {
        b.classList.add("wrong");
        navigator.vibrate?.(80);
      }
      if (q.kind === "pic" || q.kind === "listen") {
        const e = entryFor(story, q.sayText);
        const ex = $view.querySelector(".explain");
        ex.hidden = false;
        ex.innerHTML = `<b>${esc(q.sayText)}</b> = ${esc(e?.en || "")}`;
        say(q.sayText);
      } else if (q.kind === "mc") {
        say(q.options[q.answer]);
      }
      setTimeout(() => {
        qi++;
        qi < questions.length ? renderQ() : onDone({ score, total, allScore, allTotal: questions.length });
      }, right ? 1000 : 1900);
    }));
  };
  renderQ();
}

export const starsFor = (score, total) => (score >= total ? 3 : score >= total - 1 ? 2 : score > 0 ? 1 : 0);
