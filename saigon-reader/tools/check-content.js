// Content checks: every word in every story must be in the glossary, and every
// quiz answer index must be valid. Run with `npm run check`.
import { STORIES } from "../js/data/stories.js";
import { DICTIONARY } from "../js/data/dictionary.js";
import { segment, makeLookup } from "../js/segment.js";

let problems = 0;
const ids = new Set();
for (const story of STORIES) {
  if (ids.has(story.id)) { console.log(`duplicate id ${story.id}`); problems++; }
  ids.add(story.id);
  const lookup = makeLookup(DICTIONARY, story.vocab);
  const missing = new Set();
  for (const page of story.pages) {
    for (const [vi, en] of page.sentences) {
      if (!en) { console.log(`${story.id}: missing translation for "${vi}"`); problems++; }
      for (const tok of segment(vi, lookup)) {
        if (tok.type === "word" && !tok.entry) missing.add(tok.text.toLowerCase());
      }
    }
  }
  for (const q of story.quiz) {
    if (!(q.answer >= 0 && q.answer < q.options.length)) { console.log(`${story.id}: bad quiz answer "${q.q}"`); problems++; }
  }
  if (missing.size) {
    console.log(`${story.id}: not in glossary → ${[...missing].join(", ")}`);
    problems += missing.size;
  }
}
console.log(problems ? `\n${problems} problem(s)` : `All ${STORIES.length} stories OK (${Object.keys(DICTIONARY).length} glossary entries)`);
process.exit(problems ? 1 : 0);
