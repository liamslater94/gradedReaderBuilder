import { STORIES } from "../data/stories.js";
import { state, save } from "../store.js";
import { $view, esc, confetti } from "../ui.js";
import { renderReader, startPage } from "./reader.js";
import { buildQuestions, runQuiz, starsFor } from "./quiz.js";

const storyById = (id) => STORIES.find((s) => s.id === id);

export function viewStory(id, pageParam) {
  const story = storyById(id);
  if (!story) return (location.hash = "#/library");
  renderReader(story, pageParam != null ? Number(pageParam) : startPage(story), {
    backHref: "#/library",
    pageHref: (p) => `#/story/${id}/${p}`,
    onFinish: () => (location.hash = `#/quiz/${id}`),
  });
}

export function viewStoryQuiz(id) {
  const story = storyById(id);
  if (!story) return (location.hash = "#/library");
  runQuiz({
    story,
    title: `Quiz · ${story.title}`,
    backHref: `#/story/${id}`,
    questions: buildQuestions(story, { vocab: true }),
    onDone: ({ score, total }) => {
      const prog = (state.progress[id] ||= { page: 0, done: true, quizBest: null });
      prog.quizBest = Math.max(prog.quizBest ?? 0, score);
      save();
      const stars = starsFor(score, total);
      if (stars === 3) confetti();
      const cheers = ["Cố lên! (Keep going!)", "Được rồi! (Not bad!)", "Giỏi quá! (Great job!)", "Hết sẩy! (Awesome!)"];
      const nextStory = STORIES[STORIES.indexOf(story) + 1];
      $view.innerHTML = `
        <div class="quiz-end" style="--accent:${story.color}">
          <div class="big-emoji">${stars === 3 ? "🏆" : stars === 2 ? "🎉" : "💪"}</div>
          <h2>${cheers[stars]}</h2>
          <p class="score">${score} / ${total}</p>
          <p class="stars big">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</p>
          <div class="end-actions">
            ${nextStory ? `<a class="btn primary wide" href="#/story/${nextStory.id}">Next: ${esc(nextStory.title)} →</a>` : ""}
            <button class="btn ghost wide" data-retry>Try the quiz again</button>
            <a class="btn ghost wide" href="#/review">Review your words 🃏</a>
            <a class="btn ghost wide" href="#/library">Back to the library</a>
          </div>
        </div>`;
      $view.querySelector("[data-retry]").onclick = () => viewStoryQuiz(id);
    },
  });
}
