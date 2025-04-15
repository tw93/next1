export const config = { runtime: 'edge' };

export default async function handler(req, res) {
  const { method, headers, body } = req;
  headers.delete('host');
  headers.delete('referer');

  // 设置必要的请求头
  headers.set('Accept-Encoding', 'identity');
  headers.set('Accept', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');

  // 设置其他优化头
  headers.set('X-Accel-Buffering', 'no'); // 禁用Nginx缓冲
  headers.set('Transfer-Encoding', 'chunked'); // 启用分块传输编码

  const url = `https://api.alitrip.alibaba.com/fai/ctstream001`;
  const options = {
    headers: headers,
    method: method,
    body: body,
    redirect: 'follow',
    // 添加fetch选项以优化连接
    keepalive: true, // 保持连接
    cache: 'no-store', // 禁用缓存
    // 添加超时控制
    signal: AbortSignal.timeout(25000), // 25秒超时
  };
  const modifiedRequest = new Request(url, options);
  try {
    const response = await fetch(modifiedRequest);

    // 如果响应不成功，返回错误
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Upstream server error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(response.body, response);
  } catch (e) {
    console.log('Error:', e);
    // 返回更详细的错误信息
    return new Response(JSON.stringify({
      error: 'Request failed',
      message: e.message,
      type: e.name
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
