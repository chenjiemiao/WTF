export default {
  async fetch(request, env, ctx) {
    const WALINE_ORIGIN = "https://cjm2.vercel.app";
    const url = new URL(request.url);
    
    // 简单粗暴，原样转发
    const targetUrl = WALINE_ORIGIN + url.pathname + url.search;
    
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    const response = await fetch(newRequest);
    const newResponse = new Response(response.body, response);
    
    // 加上跨域头
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return newResponse;
  }
}
