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
const jsdelivrhost = 'cdn.jsdelivr.net'
const jsdelivrpath = '/gh/zu1k/blog@gh-pages'
const myPlugin = {
    requestWillFetch: async ({request}) => {
        let url = new URL(request.url);
        url.protocol = 'https';
        url.port = '';

        let pathparts = url.pathname.split('/')
        let filename = pathparts[pathparts.length-1]

        let rnd = Math.random();
        if (filename.length===0 || /(\.html|\.md|\.xml|\.json)$/.test(filename) || !filename.includes('.')) {
            url.host = cdnhost;
        } else {
            if (rnd>0.8) {
                url.host = jsdelivrhost;
                url.pathname = jsdelivrpath + url.pathname;
            } else {
                url.host = cdnhost;
            }            
        }

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

const myHandler = new CacheFirst({
    cacheName: 'zu1k-cache-20210405',
    plugins: [
        myPlugin,
        new CacheableResponsePlugin({
            statuses: [200],
        }),
        new ExpirationPlugin({
            maxAgeSeconds: 1 * 24 * 60 * 60,
            purgeOnQuotaError: true
        })
    ]
});

routing.registerRoute( /:\/\/lgf\.im\//, myHandler)

routing.registerRoute(
    '/js/sw.js',
    new StaleWhileRevalidate()
);
