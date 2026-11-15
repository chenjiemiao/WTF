export default {
  async fetch(request, env, ctx) {
    const WALINE_ORIGIN = "https://cjm2.vercel.app";
    const url = new URL(request.url);
    
    // 第一步：浏览器发 OPTIONS 预检请求时，我们直接在这层拦截并放行，不让它去烦 Vercel！
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    // 第二步：正常的 GET/POST 请求，继续转发给 Vercel
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
