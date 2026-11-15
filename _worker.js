export default {
  async fetch(request, env, ctx) {
    const WALINE_ORIGIN = "https://cjm2.vercel.app";
    const url = new URL(request.url);
    
    // 🚨 终极拦截：只要是预检请求（OPTIONS），代理直接自己处理！
    // 绝对不让它去请求 Vercel，这样 Vercel 就不会报 403，浏览器就不会报 CORS 错误。
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200, // 返回 200 状态码，让浏览器放行
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    // 正常的请求（GET/POST），原样转发给 Vercel
    const targetUrl = WALINE_ORIGIN + url.pathname + url.search;
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    const response = await fetch(newRequest);
    const newResponse = new Response(response.body, response);
    
    // 强行加上跨域头
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    return newResponse;
  }
}
