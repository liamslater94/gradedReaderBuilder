// Generates Southern Vietnamese audio for every sentence and word using
// FPT.AI text-to-speech (voice "lannhi" = Southern female by default).
//
//   FPT_API_KEY=xxxx npm run audio            # generate missing clips
//   npm run audio -- --dry-run                # count clips & characters only
//   npm run audio -- --voice=lannhi --speed=-1 --limit=50
//
// Clips are saved as audio/<key>.mp3 and listed in audio/manifest.json.
// Existing clips (generated or recorded) are skipped, so re-runs are cheap.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allAudioTexts } from "./audio-texts.js";
import { audioKey } from "../js/audio-key.js";
import { buildManifest } from "./build-audio-manifest.js";

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")).map(([k, v]) => [k, v ?? true]));
const voice = args.voice || process.env.FPT_VOICE || "lannhi";
const speed = String(args.speed ?? process.env.FPT_SPEED ?? "0");
const endpoint = process.env.FPT_TTS_URL || "https://api.fpt.ai/hmi/tts/v5";
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "audio");
fs.mkdirSync(dir, { recursive: true });

const existing = new Set(fs.readdirSync(dir).map((f) => f.slice(0, 16)));
const todo = allAudioTexts().filter((t) => !existing.has(audioKey(t)));
const limit = args.limit ? Number(args.limit) : todo.length;
const batch = todo.slice(0, limit);
const chars = batch.reduce((n, t) => n + t.length, 0);
console.log(`${batch.length} clips to generate (${chars} characters), voice=${voice}, speed=${speed}`);
if (args["dry-run"]) process.exit(0);

const key = process.env.FPT_API_KEY;
if (!key) {
  console.error("Set FPT_API_KEY (get one at https://console.fpt.ai). Use --dry-run to just count.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// POST the text, retrying with backoff on rate limits, server errors and network failures.
async function request(body) {
  for (let attempt = 1; ; attempt++) {
    let res, json;
    try {
      res = await fetch(endpoint, { method: "POST", headers: { api_key: key, voice, speed, format: "mp3" }, body });
      json = await res.json().catch(() => ({}));
    } catch (e) {
      if (attempt >= 4) throw e;
      await sleep(2000 * 2 ** attempt);
      continue;
    }
    const link = json.async || (typeof json.message === "string" && json.message.startsWith("http") ? json.message : null);
    if (res.ok && link) return link;
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await sleep(2000 * 2 ** attempt);
      continue;
    }
    throw new Error(`TTS request failed (${res.status}): ${JSON.stringify(json)}`);
  }
}

async function synth(text) {
  // FPT requires at least 3 characters; a trailing full stop keeps short words natural.
  const link = await request(text.length < 3 ? text + "." : text);
  // The audio appears at the async link after a few seconds.
  for (let i = 0; i < 30; i++) {
    await sleep(i ? 1500 : 800);
    const a = await fetch(link);
    if (a.ok && /audio|octet-stream|mpeg/.test(a.headers.get("content-type") || "")) return Buffer.from(await a.arrayBuffer());
  }
  throw new Error(`Timed out waiting for audio: ${link}`);
}

let done = 0, failed = 0;
const queue = [...batch];
async function worker() {
  while (queue.length) {
    const text = queue.shift();
    try {
      fs.writeFileSync(path.join(dir, `${audioKey(text)}.mp3`), await synth(text));
      done++;
      if (done % 25 === 0) console.log(`  ${done}/${batch.length}`);
    } catch (e) {
      failed++;
      console.warn(`  ✗ "${text}": ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: Number(args.concurrency || 3) }, worker));
const m = buildManifest({ voice: `FPT.AI ${voice}` });
console.log(`Done: ${done} generated, ${failed} failed. Manifest lists ${Object.keys(m.files).length} clips.`);
process.exit(failed ? 1 : 0);
