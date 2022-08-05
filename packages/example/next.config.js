/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withTM = require('next-transpile-modules')([
  '@cosmos-wallet/react',
  '@cosmos-wallet/core',
])

module.exports = withTM(nextConfig)
