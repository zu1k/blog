importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/workbox-sw.js');
workbox.setConfig({
    modulePathPrefix: 'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/'
});
const { core, routing, strategies, expiration } = workbox;
const { ExpirationPlugin } = expiration;
const { CacheFirst, NetworkFirst } = strategies;
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

const cdn = 'blog.zuik.ren'
const myPlugin = {
    requestWillFetch: async ({request, event, state}) => {
        var url = new URL(request.url);
        url.protocol = 'https';
        url.host = cdn;
        url.port = '';

        var headers = new Headers(request.headers);
        headers.set('Host', cdn);
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
    cacheName: 'cache-01',
    plugins: [
        myPlugin
    ]
});

routing.registerRoute( /.*lgf\.im/, myHandler)
routing.registerRoute( /localhost.*/, myHandler)
routing.setDefaultHandler(
    new NetworkFirst({
        networkTimeoutSeconds: 3
    })
);
