import { STORIES } from "../data/stories.js";
import { recordings, speak } from "../audio.js";
import { audioKey } from "../audio-key.js";
import { canRecord, startRecording, extFor } from "../recorder.js";
import { makeZip } from "../zip.js";
import { $view, esc, toast } from "../ui.js";

// Everything in a story worth recording: sentences, key words, picture labels.
export function storyTexts(story) {
  const out = [];
  const add = (text, kind) => { if (!out.some((o) => o.text === text)) out.push({ text, kind }); };
  story.pages.forEach((p) => p.sentences.forEach(([vi]) => add(vi, "sentence")));
  (story.keywords || []).forEach(([w]) => add(w, "word"));
  story.pages.forEach((p) => (p.scene?.items || []).forEach(([, w]) => add(w, "word")));
  return out;
}

export async function viewStudio(storyId) {
  const story = STORIES.find((s) => s.id === storyId) || STORIES[0];
  const all = await recordings.all();
  const have = new Set(all.map((r) => r.key));
  const texts = storyTexts(story);
  const done = texts.filter((t) => have.has(audioKey(t.text))).length;

  $view.innerHTML = `
    <div class="page-head">
      <h1>🎙️ Studio</h1>
      <p class="sub">For native Saigon speakers: record the stories so learners hear real Southern pronunciation.</p>
    </div>
    ${canRecord() ? "" : `<p class="panel">Recording isn't supported in this browser.</p>`}
    <section class="panel">
      <label class="row">Story
        <select data-story>${STORIES.map((s) => `<option value="${s.id}" ${s.id === story.id ? "selected" : ""}>Cấp ${s.level} · ${esc(s.title)}</option>`).join("")}</select></label>
      <p class="muted small">${done}/${texts.length} recorded in this story · ${all.length} recordings on this device</p>
      <div class="bar thin"><i style="width:${(done / texts.length) * 100}%"></i></div>
      <p class="small">Tips: quiet room, phone 20 cm from your mouth, natural everyday Saigon speech (not newsreader style). Recordings play in the app straight away on this device.</p>
      <button class="btn primary" data-export ${all.length ? "" : "disabled"}>⬇️ Export all recordings (.zip)</button>
    </section>
    <div class="studio-list">
      ${texts.map((t, i) => {
        const has = have.has(audioKey(t.text));
        return `<div class="studio-row ${has ? "has" : ""}" data-i="${i}">
          <span class="sr-kind">${t.kind === "word" ? "🔤" : "💬"}</span>
          <p>${esc(t.text)}</p>
          <button class="icon-btn" data-play aria-label="Play">▶️</button>
          <button class="icon-btn rec-btn" data-rec aria-label="Record">🎙️</button>
          <button class="icon-btn" data-del aria-label="Delete recording" ${has ? "" : "hidden"}>🗑</button>
        </div>`;
      }).join("")}
    </div>`;

  $view.querySelector("[data-story]").onchange = (e) => (location.hash = `#/studio/${e.target.value}`);
  let active = null;
  $view.querySelectorAll(".studio-row").forEach((row) => {
    const t = texts[row.dataset.i];
    row.querySelector("[data-play]").onclick = () => speak(t.text);
    row.querySelector("[data-del]").onclick = async () => { await recordings.delete(t.text); viewStudio(story.id); };
    const btn = row.querySelector("[data-rec]");
    btn.onclick = async () => {
      if (active && active.row !== row) return toast("Finish the current recording first");
      if (active) {
        const blob = await active.ctl.stop();
        active = null;
        await recordings.put(t.text, blob);
        toast("Saved ✓");
        viewStudio(story.id);
        return;
      }
      try {
        active = { row, ctl: await startRecording() };
        btn.textContent = "⏹";
        btn.classList.add("recording");
      } catch {
        toast("Microphone not available");
      }
    };
  });

  const exp = $view.querySelector("[data-export]");
  if (exp) exp.onclick = async () => {
    const recs = await recordings.all();
    const files = [];
    const index = {};
    for (const r of recs) {
      const name = `${r.key}.rec.${extFor(r.type)}`;
      files.push({ name: `audio/${name}`, data: new Uint8Array(await r.blob.arrayBuffer()) });
      index[r.key] = { text: r.text, file: name };
    }
    files.push({ name: "audio/recordings.json", data: new TextEncoder().encode(JSON.stringify(index, null, 1)) });
    const url = URL.createObjectURL(makeZip(files));
    const a = Object.assign(document.createElement("a"), { href: url, download: "saigon-reader-recordings.zip" });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
}
