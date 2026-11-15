export default {
  async fetch(request, env, ctx) {
    // 你的真实后端地址
    const WALINE_ORIGIN = "https://cjm2.vercel.app";
    const url = new URL(request.url);
    
    // 直接把请求路径和参数拼接到后端上
    const targetUrl = WALINE_ORIGIN + url.pathname + url.search;
    
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    const response = await fetch(newRequest);
    const newResponse = new Response(response.body, response);
    
    // 加上跨域头，防止浏览器拦截
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return newResponse;
  }
}
