if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

function webpushrscript() {
    function webpushr1(w,d, s, id) {
        if(typeof(w.webpushr)!=='undefined') 
            return;
        w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
        var js, fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s); 
        js.id = id;
        js.async=1;
        js.src = "https://cdn.webpushr.com/app.min.js";
        fjs.parentNode.appendChild(js);
    };
    webpushr1(window, document, 'script', 'webpushr-jssdk');
    webpushr('setup',{'key':'BCIE9s5vikfzfIqnC164D6-Gwquv1Wl38cCZOj8TzG4ZvPns4u1NWzbEb8rRvF3mWZJ8sJzhhTvs0o--sLFmUyQ' });
};
setTimeout(webpushrscript, 100000);