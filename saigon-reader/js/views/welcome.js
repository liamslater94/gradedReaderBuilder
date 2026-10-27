import { state, save } from "../store.js";
import { $view } from "../ui.js";

const OPTIONS = [
  [1, "🐣", "Mới bắt đầu", "I'm a total beginner"],
  [2, "🛵", "Biết chút chút", "I know some basics"],
  [3, "☕", "Nói được", "I can hold a simple conversation"],
  [4, "🌆", "Khá rồi", "I'm comfortable. Challenge me"],
];

export function viewWelcome() {
  $view.innerHTML = `
    <div class="welcome">
      <div class="big-emoji">🛵</div>
      <h1>Chào mừng tới Saigon Reader!</h1>
      <p class="sub">A new short story from Saigon every day. It gets harder as you improve and eases off if a day was tough.</p>
      <h3>How much Vietnamese do you know?</h3>
      <div class="placement">
        ${OPTIONS.map(([lvl, icon, vi, en]) => `<button class="place" data-l="${lvl}"><span>${icon}</span><b>${vi}</b><small>${en}</small></button>`).join("")}
      </div>
      <p class="muted small">You can change this any time in Tui → Reading level.</p>
    </div>`;
  $view.querySelectorAll("[data-l]").forEach((b) => (b.onclick = () => {
    state.skill = Number(b.dataset.l);
    state.onboarded = true;
    state.daily = null;
    save();
    location.hash = "#/today";
  }));
}
