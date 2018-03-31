var CACHE_NAME = 'hextris-v1';
var urlsToCache = [
    'index.html',
    'js/main.js',
    'js/initialization.js',
    'http://fonts.googleapis.com/css?family=Exo+2',
	'style/fa/css/font-awesome.min.css',
	'style/style.css',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || getNetworkResponse(event.request);
      })
    )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      cacheNames.filter(function(cacheName) {
        if(cacheName.startsWith('hextris') && cacheName !== CACHE_NAME) {
          caches.delete(cacheName);
        }
      })
    })
  );
});

self.addEventListener('message', function(event) {
  if(event.data.activate == 'true');
    self.skipWaiting();
});

function getNetworkResponse(request) {
  return caches.open(CACHE_NAME).then(function(cache) {
    cache.match(request.url).then(function(response) {
      if(response) {
        return response;
      } else {
        fetch(request.url, {mode: 'no-cors'}).then(function(networkResponse) {
          if (!networkResponse === 200) {
            throw new Error('request failed');
          }
          cache.put(request.url, networkResponse.clone());
          return networkResponse;
        }).catch(function(err) {
          console.log('fetching error:', err);
        });
      }
    });
  });
}