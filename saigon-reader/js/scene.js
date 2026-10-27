// Illustrated story scenes: an SVG Saigon backdrop plus labelled picture items.
// A page's scene looks like:
//   { bg: "street", time: "day" | "dusk" | "night", weather: "rain", decor: "lanterns",
//     items: [["🥖", "bánh mì"], ["🌶️", "ớt"]] }
// Item labels are glossary words; tapping one opens the word sheet.

const SKIES = {
  day: ["#7cc8f2", "#d7f0ff"],
  dusk: ["#5b4b8a", "#ff9f6b"],
  night: ["#0d1b3e", "#2b3a6b"],
  storm: ["#4a5566", "#8b95a5"],
};

const HOUSE_COLORS = ["#f6c85f", "#f28b82", "#9fd5c9", "#f7a072", "#b8a9e3", "#ffd6a5", "#a0c4ff", "#e9c46a"];

let uid = 0;

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

function sky(time, weather) {
  const [top, bottom] = SKIES[weather === "rain" ? "storm" : time] || SKIES.day;
  const id = `sky${++uid}`;
  let extra = "";
  if (time === "night") {
    const r = rng(7);
    for (let i = 0; i < 18; i++) extra += `<circle cx="${r() * 400}" cy="${r() * 70}" r="${r() * 1.2 + 0.3}" fill="#fff" opacity="${0.4 + r() * 0.6}"/>`;
    extra += `<circle cx="340" cy="30" r="14" fill="#fff6d5"/>`;
  } else if (weather !== "rain") {
    extra += time === "dusk"
      ? `<circle cx="320" cy="88" r="22" fill="#ffd27a" opacity="0.9"/>`
      : `<circle cx="345" cy="28" r="16" fill="#ffe27a"/>`;
    extra += `<g fill="#fff" opacity="0.85"><ellipse cx="80" cy="30" rx="26" ry="8"/><ellipse cx="98" cy="25" rx="16" ry="8"/><ellipse cx="230" cy="44" rx="22" ry="6"/></g>`;
  }
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
    <rect width="400" height="160" fill="url(#${id})"/>${extra}`;
}

// A row of narrow Saigon “tube houses” with balconies and windows.
function tubeHouses(seed, { y = 40, h = 90, night = false } = {}) {
  const r = rng(seed);
  let x = -10;
  let out = "";
  while (x < 410) {
    const w = 34 + r() * 26;
    const top = y + r() * 30;
    const c = HOUSE_COLORS[Math.floor(r() * HOUSE_COLORS.length)];
    out += `<rect x="${x}" y="${top}" width="${w}" height="${y + h - top}" fill="${c}" stroke="#00000022"/>`;
    for (let wy = top + 8; wy < y + h - 22; wy += 20) {
      const lit = night && r() > 0.35;
      out += `<rect x="${x + 6}" y="${wy}" width="${w - 12}" height="10" rx="2" fill="${lit ? "#ffe9a8" : "#ffffffaa"}"/>`;
      out += `<rect x="${x + 3}" y="${wy + 10}" width="${w - 6}" height="3" fill="#00000033"/>`;
    }
    if (r() > 0.5) out += `<circle cx="${x + w - 8}" cy="${top + 4}" r="5" fill="#4caf50"/>`;
    x += w + 1;
  }
  return out;
}

function powerLines() {
  return `<g stroke="#2b2b2b" stroke-width="1" fill="none" opacity="0.7">
    <line x1="60" y1="20" x2="60" y2="130" stroke-width="3"/>
    <path d="M60 30 Q200 55 400 34 M60 36 Q190 70 400 44 M60 42 Q170 80 400 56 M0 40 Q30 46 60 30 M0 48 Q30 56 60 36"/>
    <path d="M60 44 q8 10 2 22 q-6 8 4 14" stroke-width="2"/></g>`;
}

function road(y = 128, night = false) {
  return `<rect y="${y}" width="400" height="${160 - y}" fill="${night ? "#3a3a46" : "#6b6b78"}"/>
    <rect y="${y}" width="400" height="5" fill="#c9c2b8"/>
    <g fill="#f4f1e8">${[20, 100, 180, 260, 340].map((x) => `<rect x="${x}" y="${y + 16}" width="40" height="3"/>`).join("")}</g>`;
}

function skyline(night) {
  const c = night ? "#1f2a4a" : "#9fb3c8";
  return `<g fill="${c}">
    <rect x="20" y="70" width="30" height="70"/><rect x="58" y="55" width="22" height="85"/><rect x="88" y="80" width="40" height="60"/>
    <path d="M150 140 L156 40 Q160 30 166 40 L172 140 Z"/><ellipse cx="166" cy="62" rx="12" ry="3"/>
    <rect x="190" y="75" width="28" height="65"/><rect x="226" y="62" width="20" height="78"/>
    <path d="M285 140 L289 30 L295 10 L301 30 L305 140 Z"/>
    <rect x="320" y="85" width="36" height="55"/><rect x="362" y="70" width="30" height="70"/></g>`;
}

function interior(wall, floor) {
  return `<rect width="400" height="160" fill="${wall}"/>
    <rect y="118" width="400" height="42" fill="${floor}"/>
    <g stroke="#00000014">${Array.from({ length: 10 }, (_, i) => `<line x1="${i * 44}" y1="118" x2="${i * 44 - 20}" y2="160"/>`).join("")}</g>`;
}

const BACKDROPS = {
  street: ({ night, time, weather }) => sky(time, weather) + tubeHouses(3, { night }) + powerLines() + road(128, night),
  alley: ({ night, time, weather }) => {
    const clip = `clip${++uid}`;
    return sky(time, weather) +
      `<clipPath id="${clip}"><rect x="118" y="0" width="164" height="142"/></clipPath><g clip-path="url(#${clip})">${tubeHouses(11, { y: 50, h: 90, night })}</g>` +
      `<polygon points="0,0 120,40 120,142 0,160" fill="#e9c46a"/><polygon points="400,0 280,40 280,142 400,160" fill="#f4a261"/>` +
      `<g fill="#ffffff88"><polygon points="20,40 60,52 60,66 20,56"/><polygon points="20,80 60,88 60,102 20,96"/><polygon points="380,40 340,52 340,66 380,56"/><polygon points="380,80 340,88 340,102 380,96"/></g>` +
      `<polygon points="120,142 280,142 400,160 0,160" fill="${night ? "#55505a" : "#b5aca0"}"/>` +
      `<path d="M0 30 Q200 70 400 26 M0 40 Q200 85 400 38" stroke="#222" fill="none" opacity="0.6"/>`;
  },
  cafe: (o) => BACKDROPS.street(o) +
    `<g><rect x="30" y="92" width="200" height="12" fill="#c0392b"/>${Array.from({ length: 10 }, (_, i) => `<rect x="${30 + i * 20}" y="92" width="10" height="12" fill="#fff"/>`).join("")}
     <path d="M30 104 h200 l-8 8 h-184 z" fill="#a93226"/></g>`,
  market: ({ time, weather, night }) => sky(time, weather) + tubeHouses(5, { y: 30, h: 70, night }) +
    `<rect y="100" width="400" height="60" fill="#d9c7a7"/>` +
    [0, 1, 2, 3].map((i) => {
      const x = i * 100 + 6;
      const col = ["#e74c3c", "#27ae60", "#2980b9", "#f39c12"][i];
      return `<rect x="${x}" y="70" width="88" height="14" fill="${col}"/>${[0, 1, 2, 3].map((k) => `<rect x="${x + k * 22}" y="70" width="11" height="14" fill="#fff"/>`).join("")}
        <rect x="${x + 4}" y="84" width="3" height="40" fill="#5d4037"/><rect x="${x + 81}" y="84" width="3" height="40" fill="#5d4037"/>
        <rect x="${x}" y="112" width="88" height="14" fill="#8d6e63"/>`;
    }).join(""),
  home: ({ night }) => interior("#fbe3c4", "#c98d5e") +
    `<rect x="40" y="30" width="80" height="60" fill="${night ? "#1d2b53" : "#bfe6ff"}" stroke="#8d6e63" stroke-width="5"/><line x1="80" y1="30" x2="80" y2="90" stroke="#8d6e63" stroke-width="4"/>
     <rect x="250" y="40" width="110" height="10" fill="#8d6e63"/><rect x="270" y="20" width="16" height="20" fill="#d32f2f"/><circle cx="315" cy="30" r="8" fill="#ffca28"/>
     <rect x="160" y="96" width="90" height="26" rx="4" fill="#a1887f"/>`,
  kitchen: () => interior("#e8f1f2", "#9e9e9e") +
    `<rect y="88" width="400" height="30" fill="#8d6e63"/><rect y="84" width="400" height="6" fill="#bcaaa4"/>
     <rect x="60" y="70" width="60" height="14" rx="3" fill="#455a64"/><rect x="280" y="20" width="80" height="44" fill="#cfd8dc" stroke="#90a4ae" stroke-width="3"/>
     <g fill="#90a4ae">${[0, 1, 2, 3, 4].map((i) => `<rect x="${150 + i * 18}" y="30" width="4" height="22"/>`).join("")}</g>`,
  park: ({ time, weather }) => sky(time, weather) +
    `<rect y="110" width="400" height="50" fill="#7cb342"/><path d="M0 140 Q200 118 400 142 L400 160 L0 160 Z" fill="#d7ccc8"/>` +
    [30, 120, 220, 330].map((x, i) => `<rect x="${x + 14}" y="70" width="8" height="48" fill="#6d4c41"/><circle cx="${x + 18}" cy="${60 - (i % 2) * 8}" r="${30 + (i % 2) * 6}" fill="${i % 2 ? "#388e3c" : "#43a047"}"/>`).join(""),
  river: ({ time, weather }) => sky(time, weather) +
    `<rect y="70" width="400" height="12" fill="#558b2f"/>${[20, 70, 140, 210, 290, 360].map((x) => `<path d="M${x} 74 q6 -26 12 0 q8 -20 14 0" fill="#33691e"/>`).join("")}
     <rect y="82" width="400" height="78" fill="#a1887f"/><g stroke="#ffffff55">${[100, 120, 140].map((y) => `<path d="M0 ${y} q50 -6 100 0 t100 0 t100 0 t100 0" fill="none"/>`).join("")}</g>`,
  city: ({ night, time, weather }) => sky(time, weather) + skyline(night) +
    `<rect y="138" width="400" height="22" fill="${night ? "#1b2440" : "#5c6f82"}"/>` +
    (night ? `<g fill="#ffe082">${Array.from({ length: 30 }, (_, i) => `<rect x="${(i * 53) % 390}" y="${80 + ((i * 37) % 55)}" width="3" height="3"/>`).join("")}</g>` : ""),
  church: ({ time, weather }) => sky(time, weather) +
    `<g fill="#c0653a"><rect x="130" y="70" width="140" height="70"/><rect x="140" y="40" width="34" height="100"/><rect x="226" y="40" width="34" height="100"/>
     <polygon points="140,40 157,0 174,40"/><polygon points="226,40 243,0 260,40"/></g>
     <g fill="#7a3a1f"><circle cx="200" cy="92" r="12"/><rect x="186" y="112" width="28" height="28"/><rect x="150" y="60" width="14" height="20"/><rect x="236" y="60" width="14" height="20"/></g>
     <rect y="140" width="400" height="20" fill="#9e9e9e"/><circle cx="60" cy="100" r="34" fill="#43a047"/><circle cx="350" cy="96" r="38" fill="#388e3c"/>`,
  rooftop: ({ night, time, weather }) => sky(time, weather) + skyline(night) +
    `<rect y="128" width="400" height="32" fill="#8d8d8d"/><g stroke="#555" stroke-width="3">${Array.from({ length: 21 }, (_, i) => `<line x1="${i * 20}" y1="110" x2="${i * 20}" y2="130"/>`).join("")}<line x1="0" y1="110" x2="400" y2="110"/></g>`,
  metro: ({ night, time, weather }) => sky(time, weather) + tubeHouses(9, { y: 60, h: 80, night }) +
    `<rect y="58" width="400" height="10" fill="#cfd8dc"/>${[40, 160, 280].map((x) => `<rect x="${x}" y="68" width="14" height="72" fill="#b0bec5"/>`).join("")}
     <rect x="70" y="36" width="250" height="22" rx="8" fill="#eceff1" stroke="#90a4ae"/><rect x="70" y="50" width="250" height="4" fill="#1e88e5"/>
     ${Array.from({ length: 9 }, (_, i) => `<rect x="${82 + i * 26}" y="40" width="16" height="8" rx="2" fill="#90caf9"/>`).join("")}` + road(140, night),
  school: ({ time, weather }) => sky(time, weather) +
    `<rect x="60" y="40" width="280" height="90" fill="#f6d365"/><rect x="60" y="34" width="280" height="10" fill="#c0392b"/>
     ${[0, 1].map((r) => Array.from({ length: 7 }, (_, i) => `<rect x="${76 + i * 38}" y="${54 + r * 34}" width="22" height="18" fill="#fff"/>`).join("")).join("")}
     <rect x="190" y="98" width="20" height="32" fill="#6d4c41"/><line x1="40" y1="30" x2="40" y2="130" stroke="#555" stroke-width="2"/><rect x="40" y="30" width="22" height="14" fill="#da251d"/>
     <polygon points="51,33 52.5,37 56,37 53,39 54,43 51,40.5 48,43 49,39 46,37 49.5,37" fill="#ffde00"/>
     <rect y="130" width="400" height="30" fill="#bdbdbd"/>`,
  bus: () => interior("#fff3e0", "#78909c") +
    `${[0, 1, 2, 3].map((i) => `<rect x="${20 + i * 96}" y="22" width="80" height="50" rx="8" fill="#90caf9" stroke="#607d8b" stroke-width="4"/>`).join("")}
     <line x1="0" y1="14" x2="400" y2="14" stroke="#b0bec5" stroke-width="4"/>${[60, 160, 260, 360].map((x) => `<path d="M${x} 14 v12 a6 6 0 1 0 0.1 0" stroke="#90a4ae" stroke-width="2" fill="none"/>`).join("")}
     ${[0, 1, 2].map((i) => `<rect x="${40 + i * 130}" y="92" width="90" height="26" rx="6" fill="#43a047"/>`).join("")}`,
};

const DECOR = {
  rain: () => {
    const r = rng(42);
    return `<g stroke="#ffffffaa" stroke-width="1.4">${Array.from({ length: 70 }, () => { const x = r() * 420, y = r() * 160; return `<line x1="${x}" y1="${y}" x2="${x - 5}" y2="${y + 12}"/>`; }).join("")}</g>`;
  },
  lanterns: () => `<path d="M0 22 Q200 50 400 18" stroke="#333" fill="none"/>` +
    [30, 90, 150, 210, 270, 330, 380].map((x, i) => {
      const y = 24 + Math.sin((x / 400) * Math.PI) * 24;
      const c = ["#e53935", "#fdd835", "#fb8c00", "#e53935", "#8e24aa", "#fdd835", "#43a047"][i];
      return `<line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y + 4}" stroke="#333"/><ellipse cx="${x}" cy="${y + 14}" rx="9" ry="11" fill="${c}"/><rect x="${x - 4}" y="${y + 24}" width="8" height="3" fill="#333"/>`;
    }).join(""),
  flood: () => `<rect y="132" width="400" height="28" fill="#6d8fa8" opacity="0.85"/><g stroke="#ffffff88">${[138, 148].map((y) => `<path d="M0 ${y} q25 -4 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none"/>`).join("")}</g>`,
  mai: () => `<g>${[[30, 60], [370, 50]].map(([x, y]) => `<path d="M${x} 140 Q${x - 6} ${y + 40} ${x + 4} ${y}" stroke="#6d4c41" stroke-width="3" fill="none"/>` +
    Array.from({ length: 12 }, (_, i) => `<circle cx="${x + Math.cos(i) * 18}" cy="${y + 20 + Math.sin(i * 1.7) * 22}" r="4" fill="#ffd600"/>`).join("")).join("")}</g>`,
  boats: () => `<g>${[[60, 118, "#8d6e63"], [190, 130, "#6d4c41"], [300, 112, "#795548"]].map(([x, y, c]) => `<path d="M${x} ${y} h70 l-10 12 h-50 z" fill="${c}"/><rect x="${x + 20}" y="${y - 14}" width="26" height="14" fill="#ffcc80"/>`).join("")}</g>`,
};

export function renderScene(scene) {
  if (!scene || typeof scene === "string") {
    return `<div class="scene emoji-scene">${scene || ""}</div>`;
  }
  const time = scene.time || "day";
  const opts = { time, night: time === "night", weather: scene.weather };
  const backdrop = (BACKDROPS[scene.bg] || BACKDROPS.street)(opts);
  const decor = [scene.weather === "rain" ? DECOR.rain() : "", scene.decor ? (DECOR[scene.decor]?.() || "") : ""].join("");
  const items = (scene.items || []).map(([pic, word], i) =>
    `<button class="scene-item" data-word="${escAttr(word)}" style="--i:${i}"><span class="si-pic">${pic}</span><span class="si-label">${word}</span></button>`).join("");
  return `<figure class="scene illustrated">
      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${backdrop}${decor}</svg>
      <div class="scene-items">${items}</div>
    </figure>`;
}

function escAttr(s) { return String(s).replace(/"/g, "&quot;"); }

// First emoji of a scene for thumbnails.
export function sceneEmoji(scene) {
  if (!scene) return "";
  if (typeof scene === "string") return scene;
  return scene.items?.[0]?.[0] || "";
}
