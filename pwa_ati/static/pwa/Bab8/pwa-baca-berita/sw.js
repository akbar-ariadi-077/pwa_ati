const appCacheName = 'news-app-v1';
const dataCacheName = 'news-data';
const staticAssets = [
  './',
  './app.js',
  './styles.css',
  './fallback.json',
  './images/cari-berita.png'
];

self.addEventListener('install', async function () {
  const cache = await caches.open(appCacheName);
  cache.addAll(staticAssets);
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const dataCache = await caches.open(dataCacheName);
  try {
    const networkResponse = await fetch(request);
    dataCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cachedResponse = await dataCache.match(request);
    return cachedResponse || await caches.match('./fallback.json');
  }
}