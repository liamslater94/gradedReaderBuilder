// Stable file key for a piece of Vietnamese text. Shared by the app and the
// audio tools so a sentence always maps to the same audio file.

export function normalizeText(text) {
  return String(text).normalize("NFC").toLowerCase().replace(/[“”"«»]/g, "").replace(/\s+/g, " ").trim();
}

function fnv1a(str, seed) {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

export function audioKey(text) {
  const n = normalizeText(text);
  return fnv1a(n, 0x811c9dc5) + fnv1a(n, 0x9747b28c);
}
