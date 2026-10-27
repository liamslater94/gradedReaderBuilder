import { STORIES, LEVELS } from "../data/stories.js";
import { state, save, reset, levelInfo, liveStreak } from "../store.js";
import { levelOf } from "../adaptive.js";
import { vietnameseVoices, shippedAudioCount, manifestReady } from "../audio.js";
import { $view, esc, say, toast } from "../ui.js";

let deferredInstall = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstall = e; });

const RATING = { easy: "😎", ok: "🙂", hard: "🥵" };

function levelChart(history) {
  const pts = history.slice(-30);
  if (pts.length < 2) return `<p class="muted small">Your reading-level chart appears after a couple of daily stories.</p>`;
  const w = 300, h = 90, step = w / (pts.length - 1);
  const y = (l) => h - ((l - 1) / 4) * (h - 14) - 7;
  const path = pts.map((p, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)} ${y(p.level).toFixed(1)}`).join(" ");
  return `<svg class="level-chart" viewBox="-14 0 ${w + 20} ${h}" role="img" aria-label="Reading level over time">
    ${[1, 2, 3, 4, 5].map((l) => `<line x1="0" x2="${w}" y1="${y(l)}" y2="${y(l)}" class="grid"/><text x="-12" y="${y(l) + 3}">${l}</text>`).join("")}
    <path d="${path}" class="line"/>
    ${pts.map((p, i) => `<circle cx="${i * step}" cy="${y(p.level)}" r="3.5" class="${p.total && p.quiz / p.total >= 0.7 ? "good" : "meh"}"/>`).join("")}
  </svg>`;
}

export async function viewMe() {
  await manifestReady;
  const lv = levelInfo();
  const s = state.settings;
  const done = STORIES.filter((x) => state.progress[x.id]?.done).length;
  const words = Object.keys(state.cards).length;
  const voices = vietnameseVoices();
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const readLevel = levelOf(state.skill);
  const hist = [...state.history].reverse().slice(0, 14);

  $view.innerHTML = `
    <div class="page-head"><h1>Tui</h1><p class="sub">Your progress & settings</p></div>
    <div class="profile">
      <div class="avatar">🧑‍🎓</div>
      <div><b>Cấp ${lv.level} · ${esc(lv.title)}</b><small>${esc(lv.titleEn)}</small>
        <div class="bar"><i style="width:${(lv.into / lv.per) * 100}%"></i></div></div>
    </div>
    <div class="stats">
      <div><b>${state.xp}</b><span>XP</span></div>
      <div><b>🔥 ${liveStreak()}</b><span>day streak</span></div>
      <div><b>${done}/${STORIES.length}</b><span>stories</span></div>
      <div><b>${words}</b><span>words</span></div>
    </div>

    <section class="panel">
      <h3>📈 Reading level: Cấp ${readLevel} · ${esc(LEVELS[readLevel].name)}</h3>
      ${levelChart(state.history)}
      ${hist.length ? `<div class="history">${hist.map((h) => {
        const st = STORIES.find((x) => x.id === h.storyId);
        return `<div class="h-row"><span class="h-date">${h.date.slice(5).split("-").reverse().join("/")}</span><span class="h-title">${st?.emoji || ""} ${esc(st?.title || h.storyId)}</span><span class="h-lvl">C${h.level}</span><span class="h-score">${h.quiz}/${h.total}</span><span>${RATING[h.rating] || ""}</span></div>`;
      }).join("")}</div>` : `<p class="muted small">No daily stories yet. <a href="#/today">Read today's →</a></p>`}
      <label class="row">Set my level manually
        <select data-level>${[1, 2, 3, 4, 5].map((l) => `<option value="${l}" ${l === readLevel ? "selected" : ""}>Cấp ${l} · ${esc(LEVELS[l].name)}</option>`).join("")}</select></label>
      <p class="muted small">Takes effect from tomorrow's story.</p>
    </section>

    ${standalone ? "" : `
    <section class="panel install">
      <h3>📲 Install the app</h3>
      ${ios
        ? `<p>On iPhone/iPad in <b>Safari</b>: tap <b>Share</b> <span class="kbd">⎋</span> then <b>Add to Home Screen</b>. It opens full-screen and works offline.</p>`
        : `<p>Install Saigon Reader as an app on this device. It works offline.</p>
           <button class="btn primary" data-install>Install</button>
           <p class="muted small">No response? In Chrome/Edge use the install icon in the address bar. In Safari on Mac use <b>File → Add to Dock</b>.</p>`}
    </section>`}

    <section class="panel">
      <h3>🗣️ Pronunciation & audio</h3>
      <p class="small">${shippedAudioCount() ? `🌴 ${shippedAudioCount()} Southern audio clips installed.` : "🤖 No Southern audio files installed yet, so the app uses your device's voice."}</p>
      <a class="btn ghost" href="#/sounds">Saigon sound guide</a>
      <a class="btn ghost" href="#/studio">🎙️ Recording studio</a>
      <label class="row">Speech speed <span class="val">${s.rate.toFixed(2)}×</span>
        <input type="range" min="0.5" max="1.2" step="0.05" value="${s.rate}" data-set="rate"></label>
      <label class="row">Device voice
        <select data-set="voiceURI">
          ${voices.length ? voices.map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.voiceURI ? "selected" : ""}>${esc(v.name)}</option>`).join("") : `<option>No Vietnamese voice installed</option>`}
        </select></label>
      <button class="btn ghost" data-test>🔊 Test voice</button>
      <p class="muted small">No Vietnamese voice? iPhone: Settings → Accessibility → Spoken Content → Voices → Vietnamese. Windows: Settings → Time & language → Speech → Add voices. Mac: System Settings → Accessibility → Spoken Content → System voice → Manage voices.</p>
    </section>

    <section class="panel">
      <h3>⚙️ Reading</h3>
      <label class="row">Text size
        <input type="range" min="0.85" max="1.5" step="0.05" value="${s.fontScale}" data-set="fontScale"></label>
      <label class="row toggle">Always show English <input type="checkbox" data-set="alwaysTranslate" ${s.alwaysTranslate ? "checked" : ""}></label>
      <label class="row toggle">Underline Southern words <input type="checkbox" data-set="highlightSouth" ${s.highlightSouth ? "checked" : ""}></label>
      <label class="row">Theme
        <select data-set="theme">
          ${["auto", "light", "dark"].map((t) => `<option value="${t}" ${s.theme === t ? "selected" : ""}>${t[0].toUpperCase() + t.slice(1)}</option>`).join("")}
        </select></label>
    </section>
    <section class="panel">
      <button class="btn danger" data-reset>Reset all progress</button>
    </section>`;

  $view.querySelectorAll("[data-set]").forEach((el) => {
    el.onchange = el.oninput = () => {
      const k = el.dataset.set;
      state.settings[k] = el.type === "checkbox" ? el.checked : el.type === "range" ? Number(el.value) : el.value;
      save();
      if (k === "rate") el.parentElement.querySelector(".val").textContent = Number(el.value).toFixed(2) + "×";
    };
  });
  $view.querySelector("[data-level]").onchange = (e) => {
    state.skill = Number(e.target.value);
    save();
    toast(`Cấp ${e.target.value} from tomorrow`);
  };
  $view.querySelector("[data-test]").onclick = () => say("Chào bạn! Hôm nay đi uống cà phê sữa đá hông?");
  $view.querySelector("[data-reset]").onclick = () => { if (confirm("Reset all progress, XP, history and flashcards?")) { reset(); location.hash = "#/welcome"; } };
  const ib = $view.querySelector("[data-install]");
  if (ib) ib.onclick = async () => {
    if (!deferredInstall) return toast("Use your browser's install option (see below)");
    deferredInstall.prompt();
    await deferredInstall.userChoice;
    deferredInstall = null;
  };
}
