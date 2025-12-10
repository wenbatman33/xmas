/*
 * Service Worker (No Cache Version)
 * 為了確保每次都能看到最新更新，此 Service Worker 不會進行任何快取。
 * 它僅保留基本的 PWA 安裝能力。
 */

const CACHE_NAME = "xmas-tree-no-cache-v1";

// Install event: 強制跳過等待，讓新的 SW 立刻生效
self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log("Service Worker installed (No Cache Mode)");
});

// Activate event: 立即控制所有頁面，並清除舊有的快取
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log("All caches deleted. Claiming clients.");
        return self.clients.claim();
      })
  );
});

// Fetch event: 直接回傳 fetch 請求 (Network Only)，不查快取
self.addEventListener("fetch", (event) => {
  // 不做任何攔截，直接讓瀏覽器如常發送請求
  // 或者是顯示回傳 fetch(event.request)
  // 這裡選擇最單純的不呼叫 event.respondWith()，或者顯式呼叫 fetch

  // 為了確保即便離線也不會卡在錯誤的快取（雖然這裡是 no-cache），
  // 我們簡單地什麼都不做，讓瀏覽器自己處理網絡請求。
  // 但為了避免有些瀏覽器行為，我們顯式回傳網絡請求：
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch((err) => {
      console.log("Network fetch failed", err);
      // 這裡可以選擇是否要顯示離線頁面，但使用者要求不要 cache，所以就讓它失敗即可
    })
  );
});
