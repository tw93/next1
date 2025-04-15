export const config = { runtime: 'edge' };

export default async function handler(req, res) {
  const { method, headers, body } = req;
  headers.delete('host');
  headers.delete('referer');

  const url = `https://api.unsplash.com/photos/random?client_id=vWb-kvQu59Z9COOwFC8mEWJ6_bUjGxTZ0r4iWv_HqSo&query=architecture&orientation=landscape`;
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
