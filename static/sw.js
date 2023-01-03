importScripts('/lib/workbox-v6.4.2/workbox-sw.js');
workbox.setConfig({
    modulePathPrefix: '/lib/workbox-v6.4.2/'
});
const { core, routing, strategies, expiration, precaching, cacheableResponse } = workbox;
const { StaleWhileRevalidate, CacheFirst, NetworkFirst, NetworkOnly } = strategies;
const { ExpirationPlugin } = expiration;
const { CacheableResponsePlugin } = cacheableResponse;
core.skipWaiting();
core.clientsClaim();
precaching.cleanupOutdatedCaches()

routing.registerRoute(
    '/sw.js',
    new StaleWhileRevalidate()
);

routing.registerRoute(
    new RegExp('\\.(css|js|woff2)$'),
    new CacheFirst({
        cacheName: 'assets-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxEntries: 200,
                maxAgeSeconds: 24 * 60 * 60,
            }),
        ]
    })
);

routing.registerRoute(
    new RegExp('\\.(png|jpg|jpeg|gif|svg|ico)$'),
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ]
    })
);

routing.registerRoute(
    new RegExp('githubusercontent'),
    new CacheFirst({
        cacheName: 'github-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 7 * 24 * 60 * 60,
            }),
        ]
    })
);

routing.registerRoute(
    new RegExp('^https://img\.shields'),
    new CacheFirst({
        cacheName: 'shields-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 10 * 60,
            }),
        ]
    })
);

routing.registerRoute(
    new RegExp('googletagmanager|cnzz|giscus|api\.github|rproxy'),
    new NetworkOnly()
);

routing.setDefaultHandler(
    new StaleWhileRevalidate({
        cacheName: 'stories',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
            }),
        ]
    })
);
