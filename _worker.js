export default {
  async fetch(request, env, ctx) {
    const ZISCUS_ORIGIN = "https://ziscus-comments.chenjiemiao.workers.dev";
    const url = new URL(request.url);
    
    // 如果是访问网页根目录，返回静态页面
    if (url.pathname === "/" || url.pathname === "/index.html") {
       return env.ASSETS.fetch(request);
    }

    // 如果是请求评论，我们让 Worker 自己去试
    let targetUrl = ZISCUS_ORIGIN + url.pathname + url.search;
    
    let response = await fetch(targetUrl);
    
    // 如果返回 404，尝试加 /api 前缀
    if (response.status === 404) {
        targetUrl = ZISCUS_ORIGIN + "/api" + url.pathname + url.search;
        response = await fetch(targetUrl);
    }

    // 如果还是 404，尝试加 /api/v1 前缀
    if (response.status === 404) {
        targetUrl = ZISCUS_ORIGIN + "/api/v1" + url.pathname + url.search;
        response = await fetch(targetUrl);
    }

    // 如果还是 404，尝试加 /v1 前缀
    if (response.status === 404) {
        targetUrl = ZISCUS_ORIGIN + "/v1" + url.pathname + url.search;
        response = await fetch(targetUrl);
    }

    // 如果依然 404，返回一个干净的报错
    if (response.status === 404) {
        return new Response(JSON.stringify({ error: "Ziscus 真实接口路径找不到，请检查源码" }), {
            status: 404,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }

    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return newResponse;
  }
}
