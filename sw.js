importScripts('js/sw-utils.js');

const APP_VERSION = 'v2'
const STATIC_CACHE = 'static-'.concat(APP_VERSION);
const DYNAMIC_CACHE = 'dynamic-'.concat(APP_VERSION);
const INMUTABLE_CACHE = 'inmutable-'.concat(APP_VERSION);

const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', event => {
    console.log('installing sw');
    const staticCache = caches.open(STATIC_CACHE)
        .then((cache) => cache.addAll(APP_SHELL));

    const inmutableCache = caches.open(INMUTABLE_CACHE)
        .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

    event.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', event => {
    const promise = new Promise((resolve) => {
        caches.keys().then((keys) => {
            keys.forEach(key => {
                if (!key.includes(APP_VERSION)) {
                    caches.delete(key);
                }
            });
            resolve();
        });
    });
    event.waitUntil(promise);
});

self.addEventListener('fetch', event => {
    const responseCWs = caches.match(event.request).then(response => {
        if (response) {
            return response;
        } else {
            return fetch(event.request)
                .then(responseWs => updateDinamycCache(DYNAMIC_CACHE, event.request, responseWs));
        }
    });
    event.respondWith(responseCWs);
});