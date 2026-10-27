// Stories from Saigon, written in colloquial Southern Vietnamese.
// Each sentence is [vietnamese, english]. Words are looked up in the story's
// own `vocab` first, then in the shared dictionary (dictionary.js).
// Each page has an illustrated `scene` (see scene.js) and each story has
// `keywords`: [word, picture] pairs taught before reading.
// Quiz entries are multiple choice { q, qEn, options, answer } or
// true/false { tf, tfEn, answer: true|false }.

import { ORIGINAL } from "./stories/original.js";
import { LEVEL_1 } from "./stories/level1.js";
import { LEVEL_2 } from "./stories/level2.js";
import { LEVEL_3 } from "./stories/level3.js";
import { LEVEL_4 } from "./stories/level4.js";
import { LEVEL_5 } from "./stories/level5.js";

// Sorted by level; within a level, in reading order.
export const STORIES = [...ORIGINAL, ...LEVEL_1, ...LEVEL_2, ...LEVEL_3, ...LEVEL_4, ...LEVEL_5]
  .map((s, i) => [s, i])
  .sort((a, b) => a[0].level - b[0].level || a[1] - b[1])
  .map(([s]) => s);

export const LEVELS = {
  1: { name: "Mới tới", en: "Just arrived", color: "#2ecc71" },
  2: { name: "Quen đường", en: "Know the streets", color: "#16a085" },
  3: { name: "Biết ăn nói", en: "Chatting with locals", color: "#f39c12" },
  4: { name: "Rành Sài Gòn", en: "Know Saigon well", color: "#e67e22" },
  5: { name: "Dân Sài Gòn", en: "Local", color: "#e74c3c" },
};
