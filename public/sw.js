const CACHE='mate-u-duo-v1';
const base=new URL('./',self.location.href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([base.href,new URL('index.html',base).href,new URL('favicon.svg',base).href,new URL('manifest.webmanifest',base).href]))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mate-u-duo-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(base.pathname))return;
  if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(new URL('index.html',base).href,copy));}return response;}).catch(()=>caches.match(new URL('index.html',base).href)));return;}
  event.respondWith(caches.match(request,{ignoreVary:true}).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;})));
});
