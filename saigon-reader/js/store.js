// Persistent app state in localStorage (per device).

const KEY = "saigon-reader-v1";

const DEFAULTS = {
  xp: 0,
  streak: { count: 0, last: null },
  progress: {}, // storyId -> { page, done, quizBest }
  cards: {}, // word key -> { vi, en, north, note, story, box, due, added }
  settings: { rate: 0.85, voiceURI: null, alwaysTranslate: false, highlightSouth: true, fontScale: 1, theme: "auto" },
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) return { ...DEFAULTS, ...saved, settings: { ...DEFAULTS.settings, ...saved.settings } };
  } catch {}
  return structuredClone(DEFAULTS);
}

export const state = load();
const listeners = new Set();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((fn) => fn(state));
}

export function onChange(fn) { listeners.add(fn); }

export function reset() {
  Object.assign(state, structuredClone(DEFAULTS));
  save();
}

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Award XP and keep the daily streak going. Returns true if the player levelled up.
export function addXP(amount) {
  const before = levelInfo().level;
  state.xp += amount;
  const t = today();
  if (state.streak.last !== t) {
    const y = new Date(Date.now() - 864e5);
    const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
    state.streak.count = state.streak.last === yesterday ? state.streak.count + 1 : 1;
    state.streak.last = t;
  }
  save();
  return levelInfo().level > before;
}

const TITLES = [
  ["Khách du lịch", "Tourist"],
  ["Người mới tới", "Newcomer"],
  ["Biết đường đi chợ", "Knows the way to market"],
  ["Ghiền cà phê sữa đá", "Iced-coffee addict"],
  ["Chạy xe máy ngon lành", "Rides like a local"],
  ["Dân Sài Gòn", "Saigonese"],
  ["Sài Gòn chính hiệu", "Saigon born & bred"],
];

export function levelInfo(xp = state.xp) {
  const per = 150;
  const level = Math.floor(xp / per) + 1;
  const [title, titleEn] = TITLES[Math.min(level - 1, TITLES.length - 1)];
  return { level, title, titleEn, into: xp % per, per };
}

export function liveStreak() {
  const y = new Date(Date.now() - 864e5);
  const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
  return state.streak.last === today() || state.streak.last === yesterday ? state.streak.count : 0;
}
