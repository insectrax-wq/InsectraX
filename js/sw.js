// sw.js - Service Worker
const CACHE_NAME = 'insectrax-v1.2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/calculadora.js',
  '/js/sw.js',
  '/manifest.json',
  '/img/logos/InsectraX.png',
  '/img/fondos/campo.jpg',
  '/img/fondos/campo2.jpg',
  '/img/fondos/campo3.jpg',
  '/img/galeria/robot1.png',
  '/img/galeria/robot2.png',
  '/img/galeria/robot3.png'
];

// Instalación
self.addEventListener('install', function(event) {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación
self.addEventListener('activate', function(event) {
  console.log('Service Worker activado');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});