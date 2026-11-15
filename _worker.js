export default {
  async fetch(request, env, ctx) {
    const ZISCUS_ORIGIN = "https://ziscus-comments.chenjiemiao.workers.dev";
    const url = new URL(request.url);
    
    // 直接转发请求到 Ziscus Worker
    const targetUrl = ZISCUS_ORIGIN + url.pathname + url.search;
    
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    const response = await fetch(newRequest);
    const newResponse = new Response(response.body, response);
    
    // 加跨域头
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return newResponse;
  }
}
