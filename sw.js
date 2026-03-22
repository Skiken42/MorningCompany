// Service Worker Morning Company
// Cache les assets pour fonctionner hors ligne et sur 3G

const CACHE_NAME = 'mc-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/images/morning/logo-complet.png',
  '/images/morning/logo-tasse.png',
];

// Installation : cache les assets statiques
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activation : supprime les anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch : cache-first pour images/CSS, network-first pour HTML
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Ne pas cacher les requêtes YouTube ou externes
  if (!url.hostname.includes('localhost') && !url.hostname.includes('127.0.0.1') &&
      url.hostname !== location.hostname) return;

  // Vidéos : cache après premier chargement
  if (e.request.url.includes('/videos/')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(e.request);
        if (cached) return cached;
        const response = await fetch(e.request);
        if (response.ok) cache.put(e.request, response.clone());
        return response;
      }).catch(() => new Response('', { status: 503 }))
    );
    return;
  }

  // Images : cache-first
  if (e.request.destination === 'image') {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(response => {
          if (response.ok) {
            caches.open(CACHE_NAME).then(c => c.put(e.request, response.clone()));
          }
          return response;
        }).catch(() => new Response('', { status: 503 }));
      })
    );
    return;
  }

  // CSS/JS : cache-first
  if (['style', 'script'].includes(e.request.destination)) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
    return;
  }

  // HTML : network-first
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
