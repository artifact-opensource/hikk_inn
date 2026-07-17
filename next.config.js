/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages builds via @cloudflare/next-on-pages; output is handled
  // by the build adapter, not next's own export.
};
module.exports = nextConfig;
