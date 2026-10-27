import { RULES } from "../phonetics.js";
import { manifestReady, shippedAudioCount, shippedVoice } from "../audio.js";
import { canRecord, startRecording, playBlob } from "../recorder.js";
import { $view, esc, say, toast } from "../ui.js";

const GROUPS = [
  ["Consonants · Phụ âm đầu", ["v", "d", "gi", "r", "qu", "hw", "tr", "s"]],
  ["Endings · Vần cuối", ["anh", "ach", "inh", "ich", "enh", "in", "en", "n", "t", "ong"]],
  ["Vowels · Nguyên âm đôi", ["ie", "uo", "uoo"]],
  ["Tones · Thanh điệu", ["nga"]],
];

export async function viewSounds() {
  await manifestReady;
  const n = shippedAudioCount();
  const byId = Object.fromEntries(RULES.map((r) => [r.id, r]));
  $view.innerHTML = `
    <div class="page-head">
      <h1>Phát âm Sài Gòn</h1>
      <p class="sub">How Saigon pronunciation differs from Hà Nội, the accent most textbooks and device voices use.</p>
    </div>
    <section class="panel audio-status ${n ? "ok" : ""}">
      <h3>${n ? "🌴 Southern audio is on" : "🤖 Using your device's voice"}</h3>
      <p>${n
        ? `${n} sentences and words have Southern audio${shippedVoice() ? ` (${esc(shippedVoice())})` : ""}. Anything else falls back to your device's voice.`
        : "Your device voice probably has a Northern accent. Use these rules to hear the Saigon difference, and see below for how to add real Southern audio."}</p>
      <details><summary>How the app gets Southern audio</summary>
        <ol>
          <li><b>Recorded by a native speaker:</b> a Saigonese friend or tutor records the stories in the <a href="#/studio">🎙️ Studio</a> on this device. Recordings play instantly here and can be exported to ship with the app.</li>
          <li><b>Southern neural voice:</b> the project includes a script that generates audio for every sentence with FPT.AI's Southern voice “Lan Nhi” (see README).</li>
          <li><b>Fallback:</b> your device's Vietnamese voice.</li>
        </ol>
      </details>
    </section>
    ${GROUPS.map(([title, ids]) => `
      <section class="rule-group">
        <h3>${title}</h3>
        ${ids.map((id) => {
          const r = byId[id];
          return `<div class="rule-card">
            <div class="rc-head"><span class="rc-label">${esc(r.label)}</span><button class="icon-btn" data-say="${esc(r.example[0])}" aria-label="Listen">🔊</button>
              ${canRecord() ? `<button class="icon-btn" data-rec="${esc(r.example[0])}" aria-label="Record yourself">🎙️</button>` : ""}</div>
            <p>${esc(r.tip)}</p>
            <p class="rc-ex"><b>${esc(r.example[0])}</b> → <span>${esc(r.example[1])}</span></p>
          </div>`;
        }).join("")}
      </section>`).join("")}
    <p class="muted small center">🎙️ = record yourself, then hear your voice next to the model. Great for shadowing practice.</p>`;

  $view.querySelectorAll("[data-say]").forEach((b) => (b.onclick = () => say(b.dataset.say)));
  let active = null;
  $view.querySelectorAll("[data-rec]").forEach((b) => (b.onclick = async () => {
    if (active) {
      const { ctl, btn, word } = active;
      active = null;
      btn.textContent = "🎙️";
      btn.classList.remove("recording");
      const blob = await ctl.stop();
      toast("Your voice…");
      await playBlob(blob);
      toast("…and the model");
      await say(word);
      return;
    }
    try {
      const ctl = await startRecording();
      active = { ctl, btn: b, word: b.dataset.rec };
      b.textContent = "⏹";
      b.classList.add("recording");
      toast(`Say “${b.dataset.rec}”, then tap ⏹`);
    } catch {
      toast("Microphone not available");
    }
  }));
}
