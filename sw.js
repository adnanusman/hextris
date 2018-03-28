var CACHE_NAME = 'hextris-v1';
var urlsToCache = [
    'index.html',
    'a.js',
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
    'images/android.png',
    'images/appstore.svg',
    'images/btn_back.svg',
    'images/btn_facebook.svg',
    'images/btn_help.svg',
    'images/btn_pause.svg',
    'images/btn_restart.svg',
    'images/btn_resume.svg',
    'images/btn_share.svg',
    'images/btn_twitter.svg',
    'images/facebook-opengraph.png',
    'images/icon_arrows.svg',
    'images/twitter-opengraph.png',
    'vendor/rrssb.min.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(urlsToCache);
      })
    );
});

self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
    
    if(requestUrl.origin === location.origin) {   
        event.respondWith(
          caches.match(event.request).then(function(response) {
              if(response) return response;
              return fetch(event.request);
          })
        )
    }
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
    )
})