export default {
  async fetch(request, env, ctx) {
    const ZISCUS_ORIGIN = "https://ziscus-comments.chenjiemiao.workers.dev";
    const url = new URL(request.url);
    
    // 如果是访问网页根目录，返回静态页面
    if (url.pathname === "/" || url.pathname === "/index.html") {
       return env.ASSETS.fetch(request);
    }

    // 其他的（比如 /comments），原封不动拼接转发！
    const targetUrl = ZISCUS_ORIGIN + url.pathname + url.search;
    
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    const response = await fetch(newRequest);
    const newResponse = new Response(response.body, response);
    
    // 强制允许跨域
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return newResponse;
  }
}
