const CACHE_NAME = 'justlearn-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './data.js',
    './manifest.json'
];

// Install: pre-cache core assets
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (k) { return k !== CACHE_NAME; })
                    .map(function (k) { return caches.delete(k); })
            );
        })
    );
    self.clients.claim();
});

// Fetch: cache-first for static assets, network-first for everything else
self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;

    var url = new URL(event.request.url);
    var isStaticAsset = ASSETS.some(function (a) {
        return url.pathname.endsWith(a.replace('./', '/').replace('./', ''));
    }) || url.pathname === '/';

    if (isStaticAsset) {
        // Cache-first: return cached version, update cache in background
        event.respondWith(
            caches.match(event.request).then(function (cached) {
                var networkFetch = fetch(event.request).then(function (response) {
                    if (response.ok) {
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, response.clone());
                        });
                    }
                    return response;
                });
                return cached || networkFetch;
            })
        );
    } else {
        // Network-first for anything else
        event.respondWith(
            fetch(event.request)
                .then(function (response) {
                    if (response.ok) {
                        var clone = response.clone();
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                })
                .catch(function () {
                    return caches.match(event.request);
                })
        );
    }
});
