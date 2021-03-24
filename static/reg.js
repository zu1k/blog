if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

function returnMainDomain() {
    let domain = window.location.hostname;
    if (domain!='lgf.im') {
        let u = new URL(window.location);
        u.host = 'lgf.im';
        window.location.replace(u.href);
    }
}

setTimeout(returnMainDomain, 10000)
