// Service worker: network-first для своих файлов.
// При наличии интернета всегда отдаёт свежую версию (обновления появляются сами),
// без интернета — из кэша (офлайн-режим работает).
const CACHE='warmap-v1';
self.addEventListener('install', e=>{ self.skipWaiting(); });
self.addEventListener('activate', e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(res=>{
      try{
        if(new URL(e.request.url).origin===location.origin){
          const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request, cp));
        }
      }catch(_){}
      return res;
    }).catch(()=> caches.match(e.request))
  );
});
