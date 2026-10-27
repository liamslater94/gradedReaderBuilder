// Leitner-style spaced repetition for saved words.
import { state, save } from "./store.js";

const DAY = 864e5;
const INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64]; // days per box

export function addCard(key, entry, storyId) {
  if (state.cards[key]) return false;
  state.cards[key] = {
    vi: entry.display || key, en: entry.en, north: entry.north || null, note: entry.note || null, pic: entry.pic || null,
    story: storyId, box: 0, due: Date.now(), added: Date.now(),
  };
  save();
  return true;
}

export function removeCard(key) {
  delete state.cards[key];
  save();
}

export function dueCards(now = Date.now()) {
  return Object.entries(state.cards)
    .filter(([, c]) => c.due <= now)
    .sort((a, b) => a[1].due - b[1].due);
}

// grade: 0 = again, 1 = good, 2 = easy
export function review(key, grade) {
  const c = state.cards[key];
  if (!c) return;
  if (grade === 0) {
    c.box = 0;
    c.due = Date.now() + 60 * 1000;
  } else {
    c.box = Math.min(c.box + grade, INTERVALS.length - 1);
    c.due = Date.now() + INTERVALS[c.box] * DAY;
  }
  save();
}
