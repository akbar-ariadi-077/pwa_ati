var CACHE_NAME = "tasklist-v1";
var urlsToCache = [
    './',
	'index.html',
	'service-worker.js',
    'manifest.webapp',
    'style/style.css',
    'scripts/todo.js',
    'img/icon192.png',
    'img/icon256.png',
    'img/icon512.png'
];
self.addEventListener('install', function(event) {
    console.log('installing service worker');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('cache opened');
                var x = cache.addAll(urlsToCache);
                console.log('cache added');
                return x;
            })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the cache
    caches.match(event.request).then(function(response) {
        return fetch(event.request).then(function(response) {
        if (response.status === 404) {
			//return caches.match('offline.html');
			console.log("Offline");
			event.respondWith(pullFromCache(event));
        }
        return response
      });
    }).catch(function() {
      // If both fail, show a generic fallback:
      return caches.match('index.html');
    })
  );
});

function pullFromCache(event) {
  return caches.match(event.request).then((response) => {
    return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
  });
}