export const config = { runtime: "edge" };

export default async function handler(req, res) {
  const {
    nextUrl: { pathname },
    method,
    headers,
    body,
  } = req;
  headers.delete("host");
  headers.delete("referer");

  let path = pathname.split("/proxy-ali");
  path.shift();
  path = path.join("");

  const url = `https://api.alitrip.alibaba.com/${path}`;
  const options = {
    headers: {
      ...headers,
      'Accept-Encoding': 'identity'
    },
    method: method,
    body: body,
    redirect: "follow",
  };
  const modifiedRequest = new Request(url, options);
  try {
    const response = await fetch(modifiedRequest);
    const modifiedResponse = new Response(response.body, response);

    // Add necessary headers for streaming responses
    modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
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
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
