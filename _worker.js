export default {
  async fetch(request, env, ctx) {
    const ZISCUS_ORIGIN = "https://ziscus-comments.chenjiemiao.workers.dev";
    const url = new URL(request.url);
    
    // 核心：只有以 /comments 开头的请求，才转发给真实的 Worker
    if (url.pathname.startsWith("/comments")) {
      const targetUrl = ZISCUS_ORIGIN + url.pathname + url.search;
      
      const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      const response = await fetch(newRequest);
      const newResponse = new Response(response.body, response);
      
      // 强制允许跨域，解决前端请求的 CORS 问题
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return newResponse;
    }
    
    // 如果不是 /comments 的请求，就默认返回静态文件（比如 index.html）
    return env.ASSETS.fetch(request);
  }
}
