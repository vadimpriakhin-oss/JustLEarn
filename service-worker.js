'use strict';

const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
    '/index.html',
    '/styles/main.css',
    '/script/main.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache).catch((err) => {
                    console.error('Cache addAll failed:', err);
                });
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (!response || response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response;
            })
            .catch(async (error) => {
                console.error('Fetch failed; returning offline page instead.', error);
                const cache = await caches.open(CACHE_NAME);
                return cache.match('/index.html');
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map(async (cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        try {
                            await caches.delete(cacheName);
                        } catch (error) {
                            console.error('Cache deletion failed:', error);
                        }
                    }
                })
            );
        })
    );
});