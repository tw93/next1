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

  const url = `https://pre-api.alitrip.alibaba.com/fai/ctstream001`;
  const options = {
    headers: headers,
    method: method,
    body: body,
    redirect: 'follow',
    // 添加fetch选项以优化连接
    keepalive: true, // 保持连接
    cache: 'no-store', // 禁用缓存
  };
  const modifiedRequest = new Request(url, options);
  try {
    const response = await fetch(modifiedRequest);
    return new Response(response.body, response);
  } catch (e) {
    console.log('catch: ', e);
  }
}
