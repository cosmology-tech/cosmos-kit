/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: false,
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
            plugins: [
              'inline-import-data-uri'
            ]
          },
        },
      ],
    });

    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
};
