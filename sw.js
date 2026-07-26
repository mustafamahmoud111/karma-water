/* Keeps the page working with no connection. It cannot wake itself up on a
   timer — only the extension can nag with everything closed. */
const CACHE = "watercheck-v1";
const FILES = ["./", "./index.html", "./icon-192.png", "./icon-512.png",
  "./manifest.webmanifest", "./lottie_light.min.js",
  "./lottie/1-cushion.json", "./lottie/2-calico.json", "./lottie/3-tuxedo.json",
  "./lottie/4-playing.json", "./lottie/5-napping.json", "./lottie/6-peeking.json",
  "./lottie/7-sitting.json", "./lottie/8-working.json", "./lottie/9-moon.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request, { ignoreSearch: true })));
});

/* Clicking the pop-up focuses the app instead of opening a second copy. */
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true })
    .then((list) => (list.length ? list[0].focus() : self.clients.openWindow("./"))));
});
