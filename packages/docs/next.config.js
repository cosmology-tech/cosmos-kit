const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  unstable_staticImage: true,
  unstable_flexsearch: {
    codeblock: false,
  },
});

module.exports = {
  ...withNextra({
    reactStrictMode: true,
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
              plugins: ["inline-import-data-uri"],
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
