var CACHE_NAME = 'a2hc-v1';
var urlsToCache = [
    '/pwa/data/diri/pwa?v1',
	'index.html?v1',
	'offline.html?v1',
    'sw.js?v1',
    'manifest.json?v1',
    'A2HS.js?v1',
    'logo.png?v1',
    'logo192.png?v1',
    'logo256.png?v1',
    'logo512.png?v1'	
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