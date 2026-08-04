const CACHE = "cupofcode-v3";

const ASSETS = [
  "/",
  "/posts",
  "/assets",
  "/snippets",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/rss.xml",
  "/robots.txt",
  "/manifest.json",
  "/favicon.svg",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Hanya tangani request same-origin; biarkan cross-origin (font/analytics/dll) lewat.
  if (url.origin !== self.location.origin) return;

  // Deteksi navigasi (HTML): via mode atau header Accept.
  const isNavigation =
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html");

  if (isNavigation) {
    // Network-first: HTML selalu fresh, fallback cache saat offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // Aset statis (CSS/JS/font/img): cache-first, isi cache dari network.
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
      );
    })
  );
});
