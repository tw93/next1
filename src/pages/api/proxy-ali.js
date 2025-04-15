export const config = { runtime: "edge" };

export default async function handler(req, res) {
  const {
    nextUrl: { pathname },
    method,
    headers,
  } = req;

  // Handle OPTIONS preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400', // 24 hours
      },
    });
  }

  headers.delete("host");
  headers.delete("referer");

  let path = pathname.split("/proxy-ali");
  path.shift();
  path = path.join("");

  const url = `https://api.alitrip.alibaba.com/fai/ctstream001/${path}`;

  // Properly handle request body for POST requests
  let requestBody = null;
  if (method === 'POST') {
    try {
      requestBody = await req.text();
    } catch (e) {
      console.error('Error reading request body:', e);
    }
  }

  const options = {
    headers: {
      ...headers,
      'Accept-Encoding': 'identity'
    },
    method: method,
    body: requestBody,
    redirect: "follow",
  };

  console.log(`Proxying ${method} request to: ${url}`);
  if (requestBody) {
    console.log(`Request body: ${requestBody.substring(0, 100)}${requestBody.length > 100 ? '...' : ''}`);
  }

  const modifiedRequest = new Request(url, options);
  try {
    const response = await fetch(modifiedRequest);
    const modifiedResponse = new Response(response.body, response);

    // Add necessary headers for streaming responses and CORS
    modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
    modifiedResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    modifiedResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    modifiedResponse.headers.set("Accept", "text/event-stream");
    modifiedResponse.headers.set("Cache-Control", "no-cache");
    modifiedResponse.headers.set("Connection", "keep-alive");

    // Set content encoding to empty to prevent compression
    modifiedResponse.headers.set("Content-Encoding", "");

    return modifiedResponse;
  } catch (e) {
    console.log("catch: ", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
      }
    });
  }
}
