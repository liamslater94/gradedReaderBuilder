// Every piece of text the app can play: story sentences, glossary words used in
// stories, keywords, picture labels, quiz answers and pronunciation examples.
import { STORIES } from "../js/data/stories.js";
import { DICTIONARY } from "../js/data/dictionary.js";
import { segment, makeLookup } from "../js/segment.js";
import { RULES } from "../js/phonetics.js";

export function allAudioTexts() {
  const texts = new Set();
  for (const story of STORIES) {
    const lookup = makeLookup(DICTIONARY, story.vocab);
    for (const page of story.pages) {
      for (const [vi] of page.sentences) {
        texts.add(vi);
        for (const t of segment(vi, lookup)) if (t.entry) texts.add(t.entry.key);
      }
      for (const [, w] of page.scene?.items || []) texts.add(w);
    }
    for (const [w] of story.keywords || []) texts.add(w);
    for (const q of story.quiz) {
      if ("tf" in q) texts.add(q.tf);
      else { texts.add(q.q); texts.add(q.options[q.answer]); }
    }
  }
  for (const r of RULES) texts.add(r.example[0]);
  for (const k of Object.keys(DICTIONARY)) if (DICTIONARY[k].north) texts.add(k);
  return [...texts];
}
