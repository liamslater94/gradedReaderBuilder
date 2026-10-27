// Adaptive daily story selection.
//
// The learner has a continuous `skill` (1.0–5.99); today's level is floor(skill).
// After each daily story we record how it went, and when the next day's story is
// chosen, skill moves by up to one level based on that result:
//   comprehension score  ≥90% +2 · ≥70% +1 · ≥50% 0 · <50% −2
//   self-rating          easy +1 · ok 0 · hard −2
//   word look-ups        ≤0.3 per sentence +1 · ≥1.5 per sentence −1
// skill += clamp(points × 0.25, −1, +1). After 3+ days away, skill eases back 0.5.
// Climbing back into a level the learner struggled with in the past week takes
// twice the evidence (the upward step is halved), so they aren't bounced into
// it every other day.

export const MIN_SKILL = 1;
export const MAX_SKILL = 5.99;
export const levelOf = (skill) => Math.floor(Math.min(MAX_SKILL, Math.max(MIN_SKILL, skill)));

export function scoreResult(r) {
  const perf = r.total ? r.quiz / r.total : 0;
  const lookupRate = r.sentences ? r.lookups / r.sentences : 0;
  const quizPts = perf >= 0.9 ? 2 : perf >= 0.7 ? 1 : perf >= 0.5 ? 0 : -2;
  const ratePts = { easy: 1, ok: 0, hard: -2 }[r.rating] ?? 0;
  const lookupPts = lookupRate <= 0.3 ? 1 : lookupRate >= 1.5 ? -1 : 0;
  const points = quizPts + ratePts + lookupPts;
  return { perf, lookupRate, points, delta: Math.max(-1, Math.min(1, points * 0.25)) };
}

export function daysBetween(a, b) {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 864e5);
}

// Work out today's skill from yesterday's (most recent) result.
export function nextSkill({ skill, last, today, alreadyApplied, failedLevel = null }) {
  let s = skill;
  let delta = 0;
  let rusty = false;
  if (last && !alreadyApplied) {
    delta = scoreResult(last).delta;
    if (delta > 0 && failedLevel && levelOf(s + delta) >= failedLevel && levelOf(s) < failedLevel) delta /= 2;
    s += delta;
  }
  if (last && daysBetween(last.date, today) >= 3) {
    rusty = true;
    s -= 0.5;
  }
  s = Math.min(MAX_SKILL, Math.max(MIN_SKILL, s));
  return { skill: s, delta, rusty };
}

// Highest level with a struggling result (negative delta) in the week before `today`.
export function recentFailedLevel(history, today) {
  let lvl = null;
  for (const h of history) {
    const age = daysBetween(h.date, today);
    if (age >= 1 && age <= 7 && scoreResult(h).delta < 0) lvl = Math.max(lvl ?? 0, h.level);
  }
  return lvl;
}

export function explain({ before, after, delta, rusty, first }) {
  const lb = levelOf(before), la = levelOf(after);
  if (first) return { vi: "Truyện đầu tiên của bạn. Chúc vui nha!", en: "Your first daily story. Have fun!", dir: 0 };
  if (rusty && la <= lb) return { vi: "Lâu quá hông gặp! Mình đọc nhẹ nhàng lại nha.", en: "Long time no see! Easing you back in.", dir: la < lb ? -1 : 0 };
  if (la > lb) return { vi: `Hôm qua giỏi quá! Lên Cấp ${la} nha 🚀`, en: `Great job yesterday! Moving up to level ${la}.`, dir: 1 };
  if (la < lb) return { vi: `Hôm qua hơi khó. Cấp ${la} cho từ từ nha.`, en: `Yesterday was tough, so today is level ${la}. Step by step.`, dir: -1 };
  if (delta > 0) return { vi: "Sắp lên cấp rồi đó!", en: "You're close to levelling up!", dir: 0 };
  if (delta < 0) return { vi: `Ở lại Cấp ${la} thêm chút nha.`, en: `Staying at level ${la} a little longer.`, dir: 0 };
  return { vi: `Tiếp tục Cấp ${la} nha.`, en: `Carrying on at level ${la}.`, dir: 0 };
}

// Pick today's story: first unread story at the level, else the nearest level
// with unread stories (searching in the direction the learner is moving), else
// the least recently read story at the level.
export function pickStory(stories, level, { readIds, lastReadDate = {}, preferUp = false }) {
  const unreadAt = (l) => stories.filter((s) => s.level === l && !readIds.has(s.id));
  const atLevel = unreadAt(level);
  if (atLevel.length) return atLevel[0];
  for (let d = 1; d <= 4; d++) {
    const order = preferUp ? [level + d, level - d] : [level - d, level + d];
    for (const l of order) {
      const u = unreadAt(l);
      if (u.length) return u[0];
    }
  }
  const same = stories.filter((s) => s.level === level);
  const pool = same.length ? same : stories;
  return [...pool].sort((a, b) => (lastReadDate[a.id] || "").localeCompare(lastReadDate[b.id] || ""))[0];
}
