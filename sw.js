importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/workbox-sw.js');
workbox.setConfig({
    modulePathPrefix: 'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/'
});
const { core, routing, strategies } = workbox;
const { StaleWhileRevalidate } = strategies;
core.skipWaiting();
core.clientsClaim();

routing.registerRoute(
    '/sw.js',
    new StaleWhileRevalidate()
);
