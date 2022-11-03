const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_staticImage: true,
  unstable_flexsearch: {
    codeblock: false
  }
})

module.exports = {
  ...withNextra({
  reactStrictMode: true
  }),
  images: {
    domains: ['user-images.githubusercontent.com', 'github.com', 'img.shields.io'],
    unoptimized: true
  }
}
