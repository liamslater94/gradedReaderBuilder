// Splits a Vietnamese sentence into tappable words using greedy longest-match
// against the glossary (Vietnamese words are written as space-separated syllables).

const MAX_SYLLABLES = 5;
const SYLLABLE = /[\p{L}]+(?:-[\p{L}]+)*/gu;

export function segment(text, lookup) {
  const syllables = [];
  let last = 0;
  for (const m of text.matchAll(SYLLABLE)) {
    syllables.push({ text: m[0], start: m.index, end: m.index + m[0].length, gap: text.slice(last, m.index) });
    last = m.index + m[0].length;
  }
  const tail = text.slice(last);

  const out = [];
  let i = 0;
  while (i < syllables.length) {
    let matched = 1;
    let entry = null;
    for (let n = Math.min(MAX_SYLLABLES, syllables.length - i); n >= 1; n--) {
      // Only join syllables separated by plain spaces (not punctuation).
      const group = syllables.slice(i, i + n);
      if (group.slice(1).some((s) => s.gap !== " ")) continue;
      const key = group.map((s) => s.text).join(" ").toLowerCase();
      const found = lookup(key);
      if (found) {
        matched = n;
        entry = { key, ...found };
        break;
      }
    }
    const group = syllables.slice(i, i + matched);
    if (group[0].gap) out.push({ type: "gap", text: group[0].gap });
    out.push({ type: "word", text: text.slice(group[0].start, group[group.length - 1].end), entry });
    i += matched;
  }
  if (tail) out.push({ type: "gap", text: tail });
  return out;
}

export function makeLookup(dictionary, storyVocab = {}) {
  return (key) => storyVocab[key] || dictionary[key] || null;
}
