const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  unstable_staticImage: true,
  unstable_flexsearch: {
    codeblock: false,
  },
});

module.exports = {
  ...withNextra({
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: "/",
          destination: "/v1",
          permanent: false,
        },
        {
          source: "/index",
          destination: "/v1",
          permanent: false,
        },
      ];
    },
    webpack: (
      config,
      { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    ) => {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
                ["@babel/typescript", { allowDeclareFields: true }],
              ],
            },
          },
        ],
      });

      config.resolve.extensions.push(".ts", ".tsx");
      return config;
    },
  }),
  images: {
    domains: [
      "user-images.githubusercontent.com",
      "github.com",
      "img.shields.io",
    ],
    unoptimized: true,
  },
};
