const cdn = 'blog.zuik.ren'

async function requestWillFetch(request) {
    let url = new URL(request.url);
    url.protocol = 'https';
    url.host = cdn;
    url.port = '';

    let method = request.method;
    let headers = new Headers(request.headers);
    headers.set('Host', cdn);
    headers.set('Referer', url.href);

    let response = await fetch(url.href, {
        method: method,
        headers: headers
    })

    let status = response.status;
    return new Response(response.body, {
        status,
        headers: response.headers
    });
}

importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@3.6.3/workbox/workbox-sw.js');
if (workbox) {
    workbox.setConfig({
    modulePathPrefix: 'https://cdn.jsdelivr.net/npm/workbox-cdn@3.6.3/workbox/'
    });


    const urlHandler = new workbox.strategies.CacheFirst({
        cacheName: 'cache-01',
        plugins: [
            requestWillFetch
        ]
    });

    workbox.routing.registerRoute(/cdn\.jsdelivr\.net/, 
    workbox.strategies.cacheFirst({
        cacheName: 'static-lib-01',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
        ]    
    })
    )
    workbox.routing.registerRoute( /:\/\/lgf\.im\//, urlHandler)
    workbox.routing.registerRoute( /localhost.*/, urlHandler)
}