// Register this service worker in the main thread
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/games/sudoku/000-service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Service worker code
self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Block all Poki-related domains
    if (url.hostname.includes('poki.') || 
        url.hostname.includes('po.ki') ||
        url.href.includes('poki.') ||
        url.href.includes('po.ki')) {
        console.log('Blocked Poki request:', url.href);
        event.respondWith(new Response('', { status: 403, statusText: 'Blocked by service worker' }));
        return;
    }
    
    // For all other requests, let them through
    event.respondWith(fetch(event.request));
});
