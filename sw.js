const CACHE_NAME = 'easyturno-cache-v1';
// Aggiungi qui le risorse fondamentali dell'app che vuoi mettere in cache.
// Per la nostra app a file singolo, basta la radice ('/').
const urlsToCache = [
  '/',
  'index.html', 
];

// 1. Evento 'install': viene eseguito quando il Service Worker viene installato.
self.addEventListener('install', event => {
  // Aspettiamo che la Promise interna sia risolta.
  event.waitUntil(
    // Apriamo la nostra cache.
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Aggiungiamo tutte le risorse fondamentali alla cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Evento 'fetch': viene eseguito ogni volta che l'app fa una richiesta di rete (es. per un file, un'immagine, un'API).
self.addEventListener('fetch', event => {
  event.respondWith(
    // Controlliamo se la richiesta è già presente nella cache.
    caches.match(event.request)
      .then(response => {
        // Se la troviamo nella cache, la restituiamo subito (strategia Cache First).
        if (response) {
          return response;
        }
        // Altrimenti, procediamo con la richiesta di rete.
        return fetch(event.request);
      }
    )
  );
});

// 3. Evento 'activate': viene eseguito quando il Service Worker viene attivato.
// Utile per pulire le vecchie cache.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Se la cache non è nella nostra "lista bianca", la cancelliamo.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

