// Scans audio/ and writes audio/manifest.json mapping text keys to files.
// Native-speaker recordings (<key>.rec.<ext>) win over generated audio (<key>.<ext>).
// Run after generating audio or unzipping Studio recordings into saigon-reader/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "audio");

export function buildManifest({ voice } = {}) {
  fs.mkdirSync(dir, { recursive: true });
  const old = fs.existsSync(path.join(dir, "manifest.json")) ? JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8")) : {};
  const files = {};
  let recorded = 0;
  for (const f of fs.readdirSync(dir).sort()) {
    const m = f.match(/^([0-9a-f]{16})(\.rec)?\.(mp3|m4a|webm|ogg|wav)$/);
    if (!m) continue;
    const [, key, rec] = m;
    if (rec || !files[key]?.includes(".rec.")) files[key] = f;
  }
  for (const f of Object.values(files)) if (f.includes(".rec.")) recorded++;
  const manifest = { voice: voice || old.voice || null, generated: new Date().toISOString(), recorded, files };
  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 1) + "\n");
  return manifest;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const m = buildManifest();
  console.log(`audio/manifest.json: ${Object.keys(m.files).length} clips (${m.recorded} native recordings)`);
}
