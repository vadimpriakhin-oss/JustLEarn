// Cache version — increment this string whenever you deploy updated assets
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `justlearn-${CACHE_VERSION}`;

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/data.js',
    '/styles.css',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/offline.html'
];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting()) // Activate immediately
    );
});

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) =>
                Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name)) // Remove old caches
                )
            )
            .then(() => self.clients.claim()) // Take control of all pages
    );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Network-first for HTML pages (always get the latest markup)
    if (event.request.headers.get('Accept') && event.request.headers.get('Accept').includes('text/html')) {
        event.respondWith(networkFirstStrategy(event.request));
        return;
    }

    // Cache-first for static assets (JS, CSS, images)
    event.respondWith(cacheFirstStrategy(event.request));
});

// Network-first: try network, fall back to cache, fall back to offline page
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (_err) {
        console.warn('JustLEarn SW: Network request failed, falling back to cache.', _err);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        return caches.match('/offline.html');
    }
}

// Cache-first: return from cache if available, otherwise fetch and cache
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (_err) {
        console.warn('JustLEarn SW: Asset fetch failed, falling back to cache.', _err);
        // Return offline page as last resort for navigation requests
        if (request.destination === 'document') {
            return caches.match('/offline.html');
        }
        throw _err;
    }
}
