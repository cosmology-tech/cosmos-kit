const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withTM = require('next-transpile-modules')(['@cosmos-kit/web3auth']);

/** @type {import('next').NextConfig} */
module.exports = withTM(withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: false,
});
