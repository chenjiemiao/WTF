export default {
  async fetch(request, env, ctx) {
    // 你的真实 Waline 后端地址
    const WALINE_ORIGIN = "https://cjm2.vercel.app";
    const url = new URL(request.url);
    
    // 如果是访问 Pages 的根目录，返回静态页面
    if (url.pathname === "/" || url.pathname === "/index.html") {
       return env.ASSETS.fetch(request);
    }

    // 其他的，比如 /api/comment、/api/user 等等，全部原封不动转发给 Vercel
    const targetUrl = WALINE_ORIGIN + url.pathname + url.search;
    
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    const response = await fetch(newRequest);
    const newResponse = new Response(response.body, response);
    
    // 强制允许跨域（其实 Waline 自己也有，但加上保险）
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return newResponse;
  }
}
