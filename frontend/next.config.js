/** @type {import('next').NextConfig} */

const withSvgr = require("next-svgr");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.dicebear.com"],
  },
};

module.exports = withSvgr(nextConfig);
