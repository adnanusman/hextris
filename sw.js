var CACHE_NAME = 'hextris-v9';
var urlsToCache = [
    'index.html'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    event.respondWith(getNetworkResponse(event.request));
    return;
  }

  event.respondWith(fetch(event.request));
});

self.addEventListener('activate', function(event) {

  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(function(cacheNames) {
        cacheNames.filter(function(cacheName) {
          if(cacheName.startsWith('hextris') && cacheName !== CACHE_NAME) {
          caches.delete(cacheName);
          }
        })
      })
     ]
    )
  )
});

self.addEventListener('message', function(event) {
  if(event.data.activate == 'true');
    self.skipWaiting();
});

function getNetworkResponse(request) {  
  return caches.open(CACHE_NAME).then(cache => {
    return cache.match(request).then(response => {
      if (response) return response;

      return fetch(request).then(networkResponse => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      })
    });
  });
};