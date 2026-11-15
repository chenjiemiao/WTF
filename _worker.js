export default {
  async fetch(request, env, ctx) {
    const ZISCUS_ORIGIN = "https://ziscus-comments.chenjiemiao.workers.dev";
    const url = new URL(request.url);
    
    // 如果请求的是 API 路径，转发到你的 Worker
    if (url.pathname.startsWith("/comments") || url.pathname.startsWith("/api/")) {
      const targetUrl = ZISCUS_ORIGIN + url.pathname + url.search;
      const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      const response = await fetch(newRequest);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return newResponse;
    }
    
    // 对于其他请求（如访问 index.html），返回静态资源
    return env.ASSETS.fetch(request);
  }
}
