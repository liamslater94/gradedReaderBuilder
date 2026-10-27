import { state, onChange } from "./store.js";
import { dueCards } from "./srs.js";
import { stop } from "./audio.js";
import { $view, closeSheet, sheetOpen } from "./ui.js";
import { viewHome, viewLibrary } from "./views/home.js";
import { viewToday } from "./views/daily.js";
import { viewStory, viewStoryQuiz } from "./views/story.js";
import { viewReview } from "./views/review.js";
import { viewDialect } from "./views/dialect.js";
import { viewSounds } from "./views/sounds.js";
import { viewStudio } from "./views/studio.js";
import { viewMe } from "./views/me.js";
import { viewWelcome } from "./views/welcome.js";

function applySettings() {
  const s = state.settings;
  document.documentElement.style.setProperty("--font-scale", s.fontScale);
  if (s.theme === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", s.theme);
  const due = dueCards().length;
  const badge = document.getElementById("due-badge");
  badge.hidden = !due;
  badge.textContent = due > 99 ? "99+" : due;
}
onChange(applySettings);

const TABS = { "": "home", today: "home", library: "library", story: "library", quiz: "library", review: "review", dialect: "dialect", sounds: "dialect", studio: "me", me: "me" };
const FULLSCREEN = new Set(["story", "quiz", "today", "welcome"]);

function route() {
  stop();
  closeSheet();
  let [, name = "", a, b] = location.hash.replace(/^#/, "").split("/");
  if (!state.onboarded && name !== "welcome") {
    location.replace("#/welcome");
    return;
  }
  document.querySelectorAll(".tabbar a").forEach((el) => el.classList.toggle("active", el.dataset.tab === TABS[name]));
  document.body.dataset.view = name || "home";
  document.body.classList.toggle("fullscreen", FULLSCREEN.has(name));
  const views = {
    "": () => viewHome(),
    today: () => viewToday(a, b),
    library: () => viewLibrary(),
    story: () => viewStory(a, b),
    quiz: () => viewStoryQuiz(a),
    review: () => viewReview(),
    dialect: () => viewDialect(),
    sounds: () => viewSounds(),
    studio: () => viewStudio(a),
    me: () => viewMe(),
    welcome: () => viewWelcome(),
  };
  (views[name] || views[""])();
  window.scrollTo(0, 0);
  $view.focus({ preventScroll: true });
}

window.addEventListener("hashchange", route);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSheet();
  if (document.querySelector(".reader") && !sheetOpen()) {
    if (e.key === "ArrowRight") (document.querySelector("[data-next]") || document.querySelector("[data-finish]"))?.click();
    if (e.key === "ArrowLeft") { const p = document.querySelector("[data-prev]"); if (p && !p.disabled) p.click(); }
  }
});

// A new day may start while the app stays open (e.g. installed on a phone).
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && (location.hash === "" || location.hash === "#/")) route();
});

applySettings();
route();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
