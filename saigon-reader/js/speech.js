// Text-to-speech via the browser's built-in Vietnamese voice (if installed).
import { state } from "./store.js";

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
let voices = [];

function refresh() {
  voices = synth ? synth.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("vi")) : [];
}
if (synth) {
  refresh();
  synth.addEventListener?.("voiceschanged", refresh);
}

export function vietnameseVoices() { refresh(); return voices; }
export function hasVoice() { refresh(); return voices.length > 0; }

function pickVoice() {
  return voices.find((v) => v.voiceURI === state.settings.voiceURI) || voices[0] || null;
}

export function stop() { synth?.cancel(); }

// Speak text; resolves when finished (or immediately if speech is unavailable).
export function speak(text, { rate = state.settings.rate } = {}) {
  return new Promise((resolve) => {
    if (!synth) return resolve(false);
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = rate;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    synth.speak(u);
  });
}
