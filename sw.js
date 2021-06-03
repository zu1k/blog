importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/workbox-sw.js');
workbox.setConfig({
    modulePathPrefix: 'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/'
});
const { core, routing, strategies, expiration } = workbox;
const { ExpirationPlugin } = expiration;
const { CacheFirst, StaleWhileRevalidate } = strategies;
core.skipWaiting();
core.clientsClaim();

routing.registerRoute(
    /.*cdn\.jsdelivr\.net/,
    new CacheFirst({
        cacheName: 'static-immutable',
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

const assetsHandler = new CacheFirst({
    cacheName: 'zu1k-cache-assets-20210405',
    plugins: [
        new ExpirationPlugin({
            maxAgeSeconds: 30 * 24 * 60 * 60,
            purgeOnQuotaError: true
        })
    ]
});


const staticHandler = new CacheFirst({
    cacheName: 'zu1k-cache-static-20210405',
    plugins: [
        new ExpirationPlugin({
            maxAgeSeconds: 7 * 24 * 60 * 60,
            purgeOnQuotaError: true
        })
    ]
});

const pageHandler = new CacheFirst({
    cacheName: 'zu1k-cache-page-20210405',
    plugins: [
        new ExpirationPlugin({
            maxAgeSeconds: 60 * 60,
            purgeOnQuotaError: true
        })
    ]
});

routing.registerRoute( /(\.jpg|\.png|\.jpeg|\.svg|\.ico|\.gif|\.zip|\.7z|\.rar)$/, assetsHandler);
routing.registerRoute( /(\.js|\.css)$/, staticHandler);
routing.registerRoute( /(\/|\.html|\.xml|\.json)$/, pageHandler);

routing.registerRoute(
    '/sw.js',
    new StaleWhileRevalidate()
);
