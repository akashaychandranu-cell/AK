/* PRAXAK offline cache.
   After one online visit, every page, style, font, icon and work clip is stored on the device,
   so the site keeps working with no connection.
   Pages: network first (fresh when online), cached copy when offline.
   Everything else: cache first, refreshed in the background.
   Bump VERSION whenever you change files so visitors get the new ones. */
var VERSION = 'praxak-v1';
var CORE = [
  './', 'index.html', 'work.html', 'services.html', 'plans.html', 'about.html', 'contact.html', '404.html',
  'assets/style.css', 'assets/main.js', 'assets/fonts.css',
  'assets/fonts/inter-tight-latin-400-normal.woff2', 'assets/fonts/inter-tight-latin-400-italic.woff2',
  'assets/fonts/inter-tight-latin-500-normal.woff2', 'assets/fonts/inter-tight-latin-600-normal.woff2',
  'assets/fonts/inter-tight-latin-700-normal.woff2', 'assets/fonts/inter-tight-latin-800-normal.woff2',
  'assets/fonts/instrument-serif-latin-400-normal.woff2', 'assets/fonts/instrument-serif-latin-400-italic.woff2',
  'assets/fonts/jetbrains-mono-latin-400-normal.woff2', 'assets/fonts/jetbrains-mono-latin-500-normal.woff2',
  'assets/fonts/syne-latin-600-normal.woff2', 'assets/fonts/syne-latin-700-normal.woff2', 'assets/fonts/syne-latin-800-normal.woff2',
  'favicon.svg', 'apple-touch-icon.png', 'og.jpg',
  'media/w1.jpg', 'media/w2.jpg', 'media/w3.jpg', 'media/w4.jpg', 'media/w5.jpg', 'media/w6.jpg'
];
var CLIPS = ['media/w1.mp4', 'media/w2.mp4', 'media/w3.mp4', 'media/w4.mp4', 'media/w5.mp4', 'media/w6.mp4'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    // Clips are cached best-effort so one slow video can't block the install.
    CLIPS.forEach(function (u) { c.add(u).catch(function () {}); });
    return c.addAll(CORE);
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Videos ask for byte ranges; answer them from the cached full file. */
function rangeFrom(req, res) {
  var m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  if (!m) return res;
  return res.arrayBuffer().then(function (buf) {
    var start = m[1] ? +m[1] : 0, end = m[2] ? +m[2] : buf.byteLength - 1;
    return new Response(buf.slice(start, end + 1), {
      status: 206,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'video/mp4',
        'Content-Range': 'bytes ' + start + '-' + end + '/' + buf.byteLength,
        'Content-Length': String(end - start + 1),
        'Accept-Ranges': 'bytes'
      }
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || caches.match('index.html');
      });
    }));
    return;
  }

  if (req.headers.has('range')) {
    e.respondWith(caches.match(req.url, { ignoreSearch: true }).then(function (hit) {
      return hit ? rangeFrom(req, hit) : fetch(req);
    }));
    return;
  }

  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    var net = fetch(req).then(function (res) {
      if (res.ok && res.status === 200) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
      return res;
    });
    if (hit) { net.catch(function () {}); return hit; }
    return net;
  }));
});
