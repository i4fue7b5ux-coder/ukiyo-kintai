// 浮世勤怠帖：電波がなくても開けるように、アプリのファイルを端末に保存しておく
const CACHE = 'ukiyo-kintai-v1';
const FILES = [
  './', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './img/frog_fan.webp', './img/mice.webp', './img/cat_procession.webp', './img/mouse_run.webp',
  './img/frog_jump.webp', './img/letter_writer.webp', './img/frogs_dance.webp', './img/frog_stick.webp',
  './img/skeleton.webp', './img/gashadokuro_full.webp'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // アプリ本体は新しいものを優先し、つながらないときは保存したものを使う
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then((m) => m || caches.match('./index.html')))
  );
});
