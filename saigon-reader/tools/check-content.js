// Content checks for every story: words in the glossary, keywords and picture
// labels resolvable, valid quizzes, levels 1–5. Run with `npm run check`.
import { STORIES, LEVELS } from "../js/data/stories.js";
import { DICTIONARY } from "../js/data/dictionary.js";
import { segment, makeLookup } from "../js/segment.js";

let problems = 0;
const fail = (msg) => { console.log(msg); problems++; };
const ids = new Set();
for (const story of STORIES) {
  const where = story.id;
  if (ids.has(story.id)) fail(`duplicate id ${story.id}`);
  ids.add(story.id);
  if (!LEVELS[story.level]) fail(`${where}: bad level ${story.level}`);
  for (const f of ["title", "titleEn", "place", "emoji", "color", "summary", "culture"]) if (!story[f]) fail(`${where}: missing ${f}`);
  const lookup = makeLookup(DICTIONARY, story.vocab);
  const missing = new Set();
  for (const [pi, page] of story.pages.entries()) {
    for (const [vi, en] of page.sentences) {
      if (!en) fail(`${where}: missing translation for "${vi}"`);
      for (const tok of segment(vi, lookup)) if (tok.type === "word" && !tok.entry) missing.add(tok.text.toLowerCase());
    }
    if (typeof page.scene !== "object") fail(`${where} p${pi + 1}: scene should be an object`);
    for (const [, label] of page.scene?.items || []) if (!lookup(label.toLowerCase())) fail(`${where} p${pi + 1}: picture label "${label}" not in glossary`);
  }
  if (!story.keywords || story.keywords.length < 4) fail(`${where}: needs at least 4 keywords`);
  for (const [w, pic] of story.keywords || []) {
    if (!lookup(w.toLowerCase())) fail(`${where}: keyword "${w}" not in glossary`);
    if (!pic) fail(`${where}: keyword "${w}" has no picture`);
  }
  if (!story.quiz?.length) fail(`${where}: no quiz`);
  for (const q of story.quiz || []) {
    if ("tf" in q) { if (typeof q.answer !== "boolean") fail(`${where}: true/false answer must be boolean "${q.tf}"`); }
    else if (!(q.answer >= 0 && q.answer < q.options.length)) fail(`${where}: bad quiz answer "${q.q}"`);
  }
  if (missing.size) fail(`${where}: not in glossary → ${[...missing].join(", ")}`);
}
const perLevel = Object.keys(LEVELS).map((l) => `L${l}: ${STORIES.filter((s) => s.level === Number(l)).length}`).join("  ");
console.log(problems ? `\n${problems} problem(s)` : `All ${STORIES.length} stories OK (${perLevel}; ${Object.keys(DICTIONARY).length} glossary entries)`);
process.exit(problems ? 1 : 0);
