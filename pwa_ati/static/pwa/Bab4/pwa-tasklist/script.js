var run = function () {
    // Service worker for Progressive Web App
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js?v2', {
            scope: '.' // THIS IS REQUIRED FOR RUNNING A PROGRESSIVE WEB APP FROM A NON_ROOT PATH
        }).then(function(registration) {
            // Registration was successful
            console.log('Service worker registered with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('Service worker registration failed: ', err);
        });
    }
};
window.addEventListener('load', run);