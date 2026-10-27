// Offline support: precache the app shell, serve cache-first, refresh in the background.
// Audio clips are cached the first time they play.
// Bump VERSION whenever app files change so installed apps pick up the update.
const VERSION = "v2";
const CACHE = `saigon-reader-${VERSION}`;
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "audio/manifest.json",
  "js/adaptive.js",
  "js/app.js",
  "js/audio-key.js",
  "js/audio.js",
  "js/daily.js",
  "js/phonetics.js",
  "js/recorder.js",
  "js/scene.js",
  "js/segment.js",
  "js/srs.js",
  "js/store.js",
  "js/ui.js",
  "js/zip.js",
  "js/views/daily.js",
  "js/views/dialect.js",
  "js/views/home.js",
  "js/views/me.js",
  "js/views/quiz.js",
  "js/views/reader.js",
  "js/views/review.js",
  "js/views/sounds.js",
  "js/views/story.js",
  "js/views/studio.js",
  "js/views/welcome.js",
  "js/data/dictionary-more.js",
  "js/data/dictionary.js",
  "js/data/stories.js",
  "js/data/stories/level1.js",
  "js/data/stories/level2.js",
  "js/data/stories/level3.js",
  "js/data/stories/level4.js",
  "js/data/stories/level5.js",
  "js/data/stories/original.js",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("saigon-reader-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return;

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request, { ignoreSearch: sameOrigin });
      const network = fetch(e.request)
        .then((res) => {
          if (res.ok || res.type === "opaque") cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
