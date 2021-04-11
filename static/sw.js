importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/workbox-sw.js');
workbox.setConfig({
    modulePathPrefix: 'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/'
});
const { core, routing, strategies, expiration, cacheableResponse } = workbox;
const { ExpirationPlugin } = expiration;
const { CacheFirst, StaleWhileRevalidate } = strategies;
const { CacheableResponsePlugin } = cacheableResponse;
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

const cdnhost = 'doge.blog.zuik.ren'
const myPlugin = {
    requestWillFetch: async ({request}) => {
        let url = new URL(request.url);
        url.protocol = 'https';
        url.port = '';
        url.host = cdnhost;

        var headers = new Headers(request.headers);
        headers.set('Host', url.host);
        headers.set('Referer', url.href);

        var req = new Request(url.href, {
            method: request.method,
            headers: headers,
            mode: 'cors',
            redirect: 'manual'
        });
        return req;
    }
};

const assetsHandler = new CacheFirst({
    cacheName: 'zu1k-cache-assets-20210405',
    plugins: [
        myPlugin,
        new CacheableResponsePlugin({
            statuses: [200],
        }),
        new ExpirationPlugin({
            maxAgeSeconds: 30 * 24 * 60 * 60,
            purgeOnQuotaError: true
        })
    ]
});


const staticHandler = new CacheFirst({
    cacheName: 'zu1k-cache-static-20210405',
    plugins: [
        myPlugin,
        new CacheableResponsePlugin({
            statuses: [200],
        }),
        new ExpirationPlugin({
            maxAgeSeconds: 7 * 24 * 60 * 60,
            purgeOnQuotaError: true
        })
    ]
});

const pageHandler = new CacheFirst({
    cacheName: 'zu1k-cache-page-20210405',
    plugins: [
        myPlugin,
        new CacheableResponsePlugin({
            statuses: [200],
        }),
        new ExpirationPlugin({
            maxAgeSeconds: 60 * 60,
            purgeOnQuotaError: true
        })
    ]
});

routing.registerRoute( /:\/\/lgf\.im\/.*(\.jpg|\.png|\.jpeg|\.svg|\.ico|\.gif|\.zip|\.7z|\.rar)$/, assetsHandler);
routing.registerRoute( /:\/\/lgf\.im\/.*(\.js|\.css)$/, staticHandler);
routing.registerRoute( /:\/\/lgf\.im\/.*(\/|\.html|\.xml|\.json)$/, pageHandler);

routing.registerRoute(
    '/sw.js',
    new StaleWhileRevalidate()
);
