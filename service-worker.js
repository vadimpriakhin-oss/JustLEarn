const FILES_TO_CACHE = [
  '/index.html',
  '/app.js',
  '/data.js',
  '/styles.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('your-cache-name').then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
