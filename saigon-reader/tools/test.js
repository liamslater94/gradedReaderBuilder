// Unit tests: adaptive difficulty, story picking, phonetics, audio keys.
// Run with `npm test`.
import test from "node:test";
import assert from "node:assert/strict";
import { scoreResult, nextSkill, pickStory, levelOf, explain, recentFailedLevel } from "../js/adaptive.js";
import { STORIES } from "../js/data/stories.js";
import { southernTips } from "../js/phonetics.js";
import { audioKey, normalizeText } from "../js/audio-key.js";

const result = (o) => ({ date: "2026-10-26", quiz: 4, total: 4, lookups: 2, sentences: 13, rating: "ok", ...o });

test("a perfect, easy day with few look-ups moves up a whole level", () => {
  assert.equal(scoreResult(result({ rating: "easy" })).delta, 1);
});

test("a bad, hard day moves down a whole level", () => {
  assert.equal(scoreResult(result({ quiz: 1, rating: "hard", lookups: 25 })).delta, -1);
});

test("an okay day nudges skill without changing level", () => {
  const { delta } = scoreResult(result({ quiz: 3, lookups: 8 }));
  assert.ok(delta > 0 && delta < 1, `delta ${delta}`);
});

test("lots of look-ups count against the learner", () => {
  const few = scoreResult(result({ lookups: 1 })).delta;
  const many = scoreResult(result({ lookups: 30 })).delta;
  assert.ok(many < few);
});

test("yesterday's result is applied only once", () => {
  const last = result({ rating: "easy" });
  assert.equal(nextSkill({ skill: 2, last, today: "2026-10-27", alreadyApplied: false }).skill, 3);
  assert.equal(nextSkill({ skill: 2, last, today: "2026-10-27", alreadyApplied: true }).skill, 2);
});

test("after three or more days away the learner eases back", () => {
  const r = nextSkill({ skill: 3.2, last: result({ date: "2026-10-20" }), today: "2026-10-27", alreadyApplied: true });
  assert.ok(r.rusty);
  assert.equal(r.skill, 2.7);
});

test("skill stays within levels 1–5", () => {
  assert.equal(levelOf(nextSkill({ skill: 1, last: result({ quiz: 0, rating: "hard" }), today: "2026-10-27" }).skill), 1);
  assert.equal(levelOf(nextSkill({ skill: 5.9, last: result({ rating: "easy" }), today: "2026-10-27" }).skill), 5);
});

test("pickStory prefers unread stories at the level, in order", () => {
  const s = pickStory(STORIES, 2, { readIds: new Set() });
  assert.equal(s.level, 2);
  assert.equal(s.id, STORIES.find((x) => x.level === 2).id);
});

test("pickStory moves to a neighbouring level when a level is used up", () => {
  const readIds = new Set(STORIES.filter((s) => s.level === 3).map((s) => s.id));
  assert.equal(pickStory(STORIES, 3, { readIds, preferUp: true }).level, 4);
  assert.equal(pickStory(STORIES, 3, { readIds, preferUp: false }).level, 2);
});

test("pickStory re-serves the least recently read story when everything is read", () => {
  const readIds = new Set(STORIES.map((s) => s.id));
  const atLevel = STORIES.filter((s) => s.level === 1);
  const lastReadDate = Object.fromEntries(atLevel.map((s, i) => [s.id, `2026-10-${10 + i}`]));
  assert.equal(pickStory(STORIES, 1, { readIds, lastReadDate }).id, atLevel[0].id);
});

// Simulate days of reading with a fixed learner profile.
function simulate(days, profile, start = 1) {
  let skill = start;
  let last = null;
  const read = new Set();
  const levels = [];
  const history = [];
  for (let d = 0; d < days; d++) {
    const today = `2026-11-${String(d + 1).padStart(2, "0")}`;
    const n = nextSkill({ skill, last, today, failedLevel: recentFailedLevel(history, today) });
    skill = n.skill;
    const story = pickStory(STORIES, levelOf(skill), { readIds: read, preferUp: n.delta > 0 });
    read.add(story.id);
    levels.push(story.level);
    last = { date: today, level: story.level, ...profile(story.level), sentences: 15 };
    history.push(last);
  }
  return levels;
}

test("a strong learner climbs one level a day to level 5", () => {
  const levels = simulate(9, () => ({ quiz: 5, total: 5, lookups: 1, rating: "easy" }));
  assert.deepEqual(levels.slice(0, 5), [1, 2, 3, 4, 5]);
  // Once level 5 runs out, unread level 4 stories come before re-reads.
  assert.ok(levels.slice(5).every((l) => l >= 4), `levels ${levels}`);
});

test("a learner who finds level 3 hard settles at level 2 and retries level 3 less often", () => {
  const levels = simulate(9, (lvl) => (lvl >= 3 ? { quiz: 1, total: 4, lookups: 30, rating: "hard" } : { quiz: 4, total: 4, lookups: 2, rating: "easy" }));
  assert.ok(levels.every((l) => l <= 3), `levels ${levels}`);
  const threes = levels.slice(3).filter((l) => l === 3).length;
  assert.ok(threes <= 2, `retried level 3 ${threes} times in 6 days: ${levels}`);
});

test("recentFailedLevel only looks at the past week", () => {
  const hist = [result({ date: "2026-10-10", level: 4, quiz: 0, rating: "hard" }), result({ date: "2026-10-25", level: 3, quiz: 0, rating: "hard" })];
  assert.equal(recentFailedLevel(hist, "2026-10-27"), 3);
  assert.equal(recentFailedLevel(hist, "2026-11-10"), null);
});

test("explanations reflect the direction of change", () => {
  assert.equal(explain({ before: 1.5, after: 2.5, delta: 1 }).dir, 1);
  assert.equal(explain({ before: 3.1, after: 2.6, delta: -0.5 }).dir, -1);
  assert.equal(explain({ before: 1, after: 1, delta: 0, first: true }).dir, 0);
});

test("Saigon pronunciation tips", () => {
  const labels = (w) => southernTips(w).map((t) => t.label);
  assert.ok(labels("về").includes("v → y"));
  assert.ok(labels("dạ").includes("d → y"));
  assert.ok(labels("gì").includes("gi → y"));
  assert.ok(labels("nhanh").includes("-anh → -ăn"));
  assert.ok(labels("bạn").includes("-n → -ng"));
  assert.ok(labels("mãng cầu").includes("ngã → hỏi"));
  assert.ok(labels("quẹo").includes("qu → w"));
  assert.deepEqual(labels("tui"), []);
});

test("audio keys ignore case, quotes and spacing", () => {
  assert.equal(audioKey("“Dạ, cho con một ly lớn nha chú.”"), audioKey("dạ,  cho con một ly lớn nha chú."));
  assert.notEqual(audioKey("ly"), audioKey("lý"));
  assert.match(audioKey("xin chào"), /^[0-9a-f]{16}$/);
  assert.equal(normalizeText("  A  b "), "a b");
});

test("every level has at least five stories", () => {
  for (const l of [1, 2, 3, 4, 5]) assert.ok(STORIES.filter((s) => s.level === l).length >= 5, `level ${l}`);
});
