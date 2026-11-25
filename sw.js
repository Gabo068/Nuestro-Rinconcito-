const CACHE_NAME = "nuestro-rinconcito-v1";
const ARCHIVOS_BASE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/estilos.css",
  "./js/controles.js",
  "./js/animaciones.js",
  "./js/sonido.js",
  "./js/personajes.js",
  "./js/main.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_BASE))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((respuesta) => respuesta || fetch(event.request))
  );
});