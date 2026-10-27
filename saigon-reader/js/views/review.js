import { state } from "../store.js";
import { removeCard, dueCards, review } from "../srs.js";
import { $view, esc, say, gainXP, confetti } from "../ui.js";

export function viewReview() {
  const due = dueCards();
  const total = Object.keys(state.cards).length;
  if (!due.length) {
    $view.innerHTML = `
      <div class="page-head"><h1>Ôn tập</h1><p class="sub">Flashcards with spaced repetition</p></div>
      <div class="empty">
        <div class="big-emoji">${total ? "😎" : "🃏"}</div>
        <h2>${total ? "Hết bài rồi! All caught up." : "No flashcards yet"}</h2>
        <p>${total ? `You have ${total} word${total > 1 ? "s" : ""} saved. Come back later for the next review.` : "Finish today's story and its new words land here. You can also tap any word and press ⭐."}</p>
        <a class="btn primary" href="#/today">Today's story</a>
      </div>
      ${total ? wordList() : ""}`;
    bindWordList();
    return;
  }
  let reviewed = 0;
  const show = () => {
    const list = dueCards();
    if (!list.length) { gainXP(reviewed * 2, `${reviewed} card${reviewed > 1 ? "s" : ""} reviewed`); confetti(25); return viewReview(); }
    const [key, c] = list[0];
    $view.innerHTML = `
      <div class="page-head"><h1>Ôn tập</h1><p class="sub">${list.length} card${list.length > 1 ? "s" : ""} due</p></div>
      <div class="flash" tabindex="0" role="button" aria-label="Flip card">
        <div class="flash-inner">
          <div class="face front">
            ${c.pic ? `<p class="fc-pic">${c.pic}</p>` : ""}
            <p class="fc-vi">${esc(c.vi)}</p>
            <p class="hint">Tap to flip</p>
          </div>
          <div class="face back">
            <p class="fc-vi small">${c.pic ? c.pic + " " : ""}${esc(c.vi)}</p>
            <p class="fc-en">${esc(c.en)}</p>
            ${c.north ? `<div class="dialect-chip"><span>🌴 Nam</span><span class="vs">Bắc: <b>${esc(c.north)}</b></span></div>` : ""}
            ${c.note ? `<p class="note">💡 ${esc(c.note)}</p>` : ""}
          </div>
        </div>
      </div>
      <div class="fc-actions"><button class="icon-btn big" data-say aria-label="Listen">🔊</button></div>
      <div class="grades" hidden>
        <button class="btn grade again" data-g="0">Quên rồi<small>Again</small></button>
        <button class="btn grade good" data-g="1">Nhớ<small>Good</small></button>
        <button class="btn grade easy" data-g="2">Dễ ợt<small>Easy</small></button>
      </div>`;
    const flash = $view.querySelector(".flash");
    const flip = () => { flash.classList.add("flipped"); $view.querySelector(".grades").hidden = false; };
    flash.onclick = flip;
    flash.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } };
    $view.querySelector("[data-say]").onclick = () => say(c.vi);
    say(c.vi);
    $view.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => { review(key, Number(b.dataset.g)); reviewed++; show(); }));
  };
  show();
}

function wordList() {
  const items = Object.entries(state.cards).sort((a, b) => b[1].added - a[1].added);
  return `
    <section class="wordlist">
      <h3>Your words (${items.length})</h3>
      ${items.map(([k, c]) => `
        <div class="wl-row">
          <button class="icon-btn" data-sayw="${esc(c.vi)}" aria-label="Listen">${c.pic || "🔊"}</button>
          <div><b>${esc(c.vi)}</b><span>${esc(c.en)}</span></div>
          <span class="box" title="Memory strength">${"●".repeat(Math.min(c.box, 5))}${"○".repeat(Math.max(0, 5 - c.box))}</span>
          <button class="icon-btn" data-del="${esc(k)}" aria-label="Remove">✕</button>
        </div>`).join("")}
    </section>`;
}

function bindWordList() {
  $view.querySelectorAll("[data-sayw]").forEach((b) => (b.onclick = () => say(b.dataset.sayw)));
  $view.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => { removeCard(b.dataset.del); viewReview(); }));
}
