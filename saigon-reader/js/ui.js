// Shared UI helpers: escaping, toasts, confetti, XP, speech and the word sheet.
import { state, addXP, levelInfo } from "./store.js";
import { speak } from "./audio.js";
import { addCard, removeCard } from "./srs.js";
import { southernTips } from "./phonetics.js";

export const $view = document.getElementById("view");
const $sheetRoot = document.getElementById("sheet-root");
const $toast = document.getElementById("toast");

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

let toastTimer;
export function toast(msg) {
  $toast.textContent = msg;
  $toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $toast.classList.remove("show"), 2200);
}

export function confetti(n = 40) {
  const bits = ["🎉", "🧧", "⭐", "🌼", "🥖", "☕", "🛵", "🥭"];
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span");
    el.className = "confetti";
    el.textContent = bits[i % bits.length];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDelay = Math.random() * 0.4 + "s";
    el.style.animationDuration = 1.6 + Math.random() * 1.2 + "s";
    el.style.setProperty("--drift", (Math.random() * 2 - 1) * 30 + "vw");
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

export function gainXP(amount, label) {
  if (!amount) return;
  const levelled = addXP(amount);
  toast(`+${amount} XP${label ? " · " + label : ""}`);
  if (levelled) {
    const lv = levelInfo();
    setTimeout(() => { confetti(60); toast(`Lên cấp ${lv.level}! ${lv.title} 🎉`); }, 900);
  }
}

let warnedNoVoice = false;
export async function say(text, opts) {
  const source = await speak(text, opts);
  if (!source && !warnedNoVoice) {
    warnedNoVoice = true;
    toast("No Vietnamese voice on this device (see Tui)");
  }
  return source;
}

const SOURCE_LABEL = {
  recording: "🎙️ Recorded Saigon voice",
  southern: "🌴 Southern voice",
  tts: "🤖 Device voice (may sound Northern)",
};

// ── Bottom sheet ───────────────────────────────────────────────────
export function openSheet(html, onMount) {
  $sheetRoot.innerHTML = `<div class="sheet-backdrop" data-close></div><div class="sheet" role="dialog"><div class="sheet-grip"></div>${html}</div>`;
  requestAnimationFrame(() => $sheetRoot.classList.add("open"));
  $sheetRoot.querySelector("[data-close]").onclick = closeSheet;
  onMount?.($sheetRoot.querySelector(".sheet"));
}

export function closeSheet() {
  $sheetRoot.classList.remove("open");
  setTimeout(() => { if (!$sheetRoot.classList.contains("open")) $sheetRoot.innerHTML = ""; }, 250);
}

export const sheetOpen = () => !!$sheetRoot.innerHTML;

export function markSavedWords() {
  document.querySelectorAll(".w[data-key]").forEach((el) => el.classList.toggle("saved", !!state.cards[el.dataset.key]));
}

// Word sheet: meaning, Southern/Northern note, Saigon sound tips, audio, save.
export function openWordSheet(word, entry, { storyId, pic, onSaved } = {}) {
  const key = entry?.key || word.toLowerCase();
  const display = entry?.key || word;
  const saved = !!state.cards[key];
  const tips = southernTips(display);
  openSheet(`
    <div class="sheet-head">
      ${pic ? `<span class="sheet-pic">${pic}</span>` : ""}
      <h2 class="vi">${esc(display)}</h2>
      <button class="icon-btn big" data-say aria-label="Listen">🔊</button>
    </div>
    <p class="audio-src" data-src></p>
    ${entry ? `<p class="meaning">${esc(entry.en)}</p>` : `<p class="meaning muted">Not in the glossary yet.</p>`}
    ${entry?.north ? `<div class="dialect-chip"><span>🌴 Miền Nam</span><span class="vs">Bắc nói: <b>${esc(entry.north)}</b></span></div>` : ""}
    ${entry?.note ? `<p class="note">💡 ${esc(entry.note)}</p>` : ""}
    ${tips.length ? `<details class="sounds"><summary>🗣️ How Saigon says it <span class="chips">${tips.map((t) => `<span class="chip">${esc(t.label)}</span>`).join("")}</span></summary>
      <ul>${tips.map((t) => `<li><b>${esc(t.label)}</b>: ${esc(t.tip)} <span class="muted">e.g. ${esc(t.example[0])} → ${esc(t.example[1])}</span></li>`).join("")}</ul>
      <a href="#/sounds">All Saigon sound rules →</a></details>` : ""}
    ${entry ? `<button class="btn ${saved ? "ghost" : "primary"} wide" data-save>${saved ? "✓ In your flashcards (tap to remove)" : "⭐ Add to flashcards"}</button>` : ""}`,
  (sheet) => {
    const play = async () => {
      const src = await say(display);
      const el = sheet.querySelector("[data-src]");
      if (el) el.textContent = SOURCE_LABEL[src] || "";
    };
    play();
    sheet.querySelector("[data-say]").onclick = play;
    const saveBtn = sheet.querySelector("[data-save]");
    if (saveBtn) saveBtn.onclick = () => {
      if (state.cards[key]) { removeCard(key); toast("Removed from flashcards"); }
      else { addCard(key, { ...entry, display: key, pic }, storyId); gainXP(2, "word saved"); }
      closeSheet();
      markSavedWords();
      onSaved?.();
    };
  });
}
