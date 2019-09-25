((self: ServiceWorkerGlobalScope) => {
    self.addEventListener("install", e => {
        e.waitUntil(
            (async () => {
                console.log("インストールされた");
                const c = await caches.open("c");
                await c.add("/");
                await self.skipWaiting();
            })()
        );
    });

    self.addEventListener("activate", e => {
        e.waitUntil(
            (async () => {
                console.log("アクティビティになった");
                await self.clients.claim();
            })()
        );
    });

    self.addEventListener("fetch", e => {
        console.log("fetchされた", e.request.url);
        if (navigator.onLine) {
            return;
        }
        if (
            e.request.url === "https://service-worker-offline.firebaseapp.com/"
        ) {
            e.respondWith(
                new Response(
                    `<!doctype html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>title</title>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="icon" href="/image.jpg">
        </head>
        <body>
            <h1>オフライン用のページ</h1>
            <div>↓の画像が表示できているなら、オフライン時にもHTTP Response Cacheが使えるということがわかる。ドメインごとに用意されている保存領域を使わなくて済む!(Cache APIと違って、一度アクセスする必要あり)</div>
            <img src="/image.jpg" alt="画像" style="width:50%">
        </body>
</html>`,
                    { headers: { "content-type": "text/html" } }
                )
            );
        }
    });

    self.addEventListener("sync", e => {
        console.log("syncされた", e);
    });
})((self as unknown) as ServiceWorkerGlobalScope);
