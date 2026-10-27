// Today's adaptive story: created once per day from the previous result.
import { STORIES } from "./data/stories.js";
import { state, save, today } from "./store.js";
import { nextSkill, explain, pickStory, levelOf, recentFailedLevel } from "./adaptive.js";

function readInfo() {
  const readIds = new Set(state.history.map((h) => h.storyId));
  for (const [id, p] of Object.entries(state.progress)) if (p.done) readIds.add(id);
  const lastReadDate = {};
  for (const h of state.history) lastReadDate[h.storyId] = h.date;
  return { readIds, lastReadDate };
}

export function ensureDaily() {
  const t = today();
  if (state.daily?.date === t) return state.daily;

  const last = state.history[state.history.length - 1] || null;
  const before = state.skill;
  const { skill, delta, rusty } = nextSkill({
    skill: before,
    last,
    today: t,
    alreadyApplied: last && state.skillAppliedFor === last.date,
    failedLevel: recentFailedLevel(state.history, t),
  });
  state.skill = skill;
  if (last) state.skillAppliedFor = last.date;

  const level = levelOf(skill);
  const story = pickStory(STORIES, level, { ...readInfo(), preferUp: delta > 0 });
  state.daily = {
    date: t,
    storyId: story.id,
    level,
    reason: explain({ before, after: skill, delta, rusty, first: !last }),
    step: "vocab",
    lookups: [],
    quiz: null,
    total: null,
    rating: null,
    done: false,
  };
  save();
  return state.daily;
}

// Swap today's story for an easier (-1) or harder (+1) one, before reading starts.
export function swapDaily(dir) {
  const d = ensureDaily();
  const level = Math.max(1, Math.min(5, d.level + dir));
  const info = readInfo();
  info.readIds.add(d.storyId);
  const story = pickStory(STORIES, level, { ...info, preferUp: dir > 0 });
  Object.assign(d, { storyId: story.id, level: story.level, step: "vocab", lookups: [] });
  state.skill = Math.max(1, Math.min(5.99, story.level + (state.skill % 1)));
  d.reason = dir < 0
    ? { vi: "Đổi truyện dễ hơn rồi nè.", en: "Switched to an easier story.", dir: -1 }
    : { vi: "Thử thách nha! Truyện khó hơn nè.", en: "Challenge accepted! A harder story.", dir: 1 };
  save();
  return d;
}

export function finishDaily({ rating }) {
  const d = state.daily;
  const story = STORIES.find((s) => s.id === d.storyId);
  const sentences = story.pages.reduce((n, p) => n + p.sentences.length, 0);
  const result = { date: d.date, storyId: d.storyId, level: d.level, quiz: d.quiz ?? 0, total: d.total ?? story.quiz.length, lookups: d.lookups.length, sentences, rating };
  d.rating = rating;
  d.done = true;
  d.step = "done";
  state.history.push(result);
  if (state.history.length > 400) state.history.shift();
  save();
  return { result, preview: previewTomorrow(result) };
}

export function previewTomorrow(result) {
  const tomorrow = new Date(Date.parse(result.date + "T12:00:00") + 864e5);
  const t = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  const { skill } = nextSkill({ skill: state.skill, last: result, today: t, failedLevel: recentFailedLevel(state.history, t) });
  return { level: levelOf(skill), from: levelOf(state.skill), skill };
}
