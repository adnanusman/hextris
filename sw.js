var CACHE_NAME = 'hextris-v3';
var urlsToCache = [
    'index.html',
    'vendor/hammer.min.js',
    'vendor/js.cookie.js',
    'vendor/jsonfn.min.js',
    'vendor/keypress.min.js',
    'vendor/jquery.js',
    'js/save-state.js',
    'js/view.js',
    'js/wavegen.js',
    'js/math.js',
    'js/Block.js',
    'js/Hex.js',
    'js/Text.js',
    'js/comboTimer.js',
    'js/checking.js',
    'js/update.js',
    'js/render.js',
    'js/input.js',
    'js/main.js',
    'js/initialization.js',
    'http://fonts.googleapis.com/css?family=Exo+2',
	'style/fa/css/font-awesome.min.css',
	'style/style.css',
    'style/rrssb.css',
    'vendor/rrssb.min.js',
    'vendor/sweet-alert.min.js'    
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
        let requestUrl = new URL(event.request.url);
          
        if(requestUrl.origin === location.origin) {
          return response || getNetworkResponse(event.request);
        }
          
        return response || fetch(event.request);
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
  caches.open(CACHE_NAME).then(function(cache) {
    fetch(request).then(function(networkResponse) {
      cache.put(request.url, networkResponse.clone());
      return networkResponse;
    }).catch(function(err) {
     console.log('fetching error:', err);
    });
 });
};