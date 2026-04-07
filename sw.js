const CACHE_NAME = 'math-finance-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 安裝時快取本地檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 攔截請求：這段邏輯會優先讀取快取，同時也會處理您引入的 Tailwind 和 Lucide CDN
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取有資料就回傳，否則透過網路抓取
        return response || fetch(event.request).then(fetchResponse => {
            // 動態將外部 CDN 的資源也存入快取，讓未來就算斷網也能保留樣式與圖示
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            });
        });
      })
  );
});
