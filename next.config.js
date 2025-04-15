/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/proxy/:slug*",
        destination: "https://api.openai.com/:slug*",
      },
      {
        source:"/switch/:slug*",
        destination: "https://nominatim.openstreetmap.org/:slug*"
      },
      {
        source: "/proxy-sse/:slug*",
        destination: "/api/proxy-sse?path=:slug*",
      },
      {
        source: "/proxy-ali/:slug*",
        destination: "/api/proxy-ali?path=:slug*",
      },
      {
        source: "/proxy-image/:slug*",
        destination: "https://images.unsplash.com/:slug*"
      },
      {
        source: "/azure/:slug*",
        destination: "/api/proxy-azure?path=:slug*",
      },
      {
        source: "/photos/:slug*",
        destination: "https://picsum.photos/:slug*",
      },
      {
        source: "/picsum/:slug*",
        destination: "https://fastly.picsum.photos/:slug*",
      },
    ];
  },
};

module.exports = nextConfig;
