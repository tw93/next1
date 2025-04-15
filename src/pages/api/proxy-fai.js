export const config = { runtime: 'edge' };

export default async function handler(req, res) {
  const { method, headers, body } = req;
  headers.delete('host');
  headers.delete('referer');

  const url = `https://pre-api.alitrip.alibaba.com/fai/ctstream001`;
  const options = {
    headers: headers,
    method: method,
    body: body,
    redirect: 'follow',
  };
  const modifiedRequest = new Request(url, options);
  try {
    const response = await fetch(modifiedRequest);
    return new Response(response.body, response);
  } catch (e) {
    console.log('catch: ', e);
  }
}
