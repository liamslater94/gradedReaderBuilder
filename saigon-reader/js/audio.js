// Audio playback, best source first:
//   1. a recording made on this device in the Studio (IndexedDB)
//   2. a Southern audio file shipped with the app (audio/manifest.json)
//   3. the device's built-in Vietnamese text-to-speech voice
import { state } from "./store.js";
import { audioKey } from "./audio-key.js";

let manifest = { files: {} };
const ready = fetch("audio/manifest.json")
  .then((r) => (r.ok ? r.json() : null))
  .then((m) => { if (m?.files) manifest = m; })
  .catch(() => {});

export const manifestReady = ready;
export function shippedAudioCount() { return Object.keys(manifest.files).length; }
export function shippedVoice() { return manifest.voice || null; }
export function hasShippedAudio(text) { return !!manifest.files[audioKey(text)]; }

// ── Device recordings (IndexedDB) ───────────────────────────────────
let dbPromise;
function db() {
  dbPromise ||= new Promise((resolve, reject) => {
    const req = indexedDB.open("saigon-reader", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("recordings");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx(mode, fn) {
  try {
    const d = await db();
    return await new Promise((resolve, reject) => {
      const t = d.transaction("recordings", mode);
      const req = fn(t.objectStore("recordings"));
      t.oncomplete = () => resolve(req?.result);
      t.onerror = () => reject(t.error);
    });
  } catch {
    return undefined;
  }
}

export const recordings = {
  get: (text) => tx("readonly", (s) => s.get(audioKey(text))),
  put: (text, blob) => tx("readwrite", (s) => s.put({ text, blob, type: blob.type, at: Date.now() }, audioKey(text))),
  delete: (text) => tx("readwrite", (s) => s.delete(audioKey(text))),
  all: () => new Promise((resolve) => {
    db().then((d) => {
      const out = [];
      const req = d.transaction("recordings").objectStore("recordings").openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (c) { out.push({ key: c.key, ...c.value }); c.continue(); } else resolve(out);
      };
      req.onerror = () => resolve(out);
    }).catch(() => resolve([]));
  }),
};

// ── Text-to-speech fallback ────────────────────────────────────────
const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

export function vietnameseVoices() {
  return synth ? synth.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("vi")) : [];
}

function tts(text, rate) {
  return new Promise((resolve) => {
    if (!synth) return resolve(false);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    const voices = vietnameseVoices();
    const v = voices.find((x) => x.voiceURI === state.settings.voiceURI) || voices[0];
    if (v) u.voice = v;
    u.rate = rate;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    synth.speak(u);
  });
}

// ── Public API ─────────────────────────────────────────────────────
let current = null;

export function stop() {
  synth?.cancel();
  if (current) { current.pause(); current = null; }
}

function playUrl(url, rate) {
  return new Promise((resolve) => {
    const a = new Audio(url);
    a.playbackRate = Math.max(0.5, Math.min(1.5, rate + 0.15));
    current = a;
    a.onended = () => resolve(true);
    a.onerror = () => resolve(false);
    a.play().catch(() => resolve(false));
  });
}

// Resolves with the source used: "recording" | "southern" | "tts" | null.
export async function speak(text, { rate = state.settings.rate } = {}) {
  stop();
  await ready;
  const rec = await recordings.get(text);
  if (rec?.blob) {
    const url = URL.createObjectURL(rec.blob);
    const ok = await playUrl(url, rate);
    URL.revokeObjectURL(url);
    if (ok) return "recording";
  }
  const file = manifest.files[audioKey(text)];
  if (file && (await playUrl(`audio/${file}`, rate))) return "southern";
  if (!vietnameseVoices().length && !synth) return null;
  return (await tts(text, rate)) ? "tts" : null;
}
