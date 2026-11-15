export default {
  async fetch(request, env, ctx) {
    const ZISCUS_ORIGIN = "https://ziscus-comments.chenjiemiao.workers.dev";
    const url = new URL(request.url);
    
    // 🚨 核心改变：如果是访问首页之类的静态文件，直接放行
    // 如果请求的是 /comments，我们手动把它转给 Worker
    if (url.pathname === "/" || url.pathname === "/index.html") {
       return env.ASSETS.fetch(request);
    }

    // 其他所有请求（包括 /comments），全部强行转发
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
