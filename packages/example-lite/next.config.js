module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              ["@babel/preset-typescript", { allowDeclareFields: true }],
            ],
            plugins: ["babel-plugin-inline-import-data-uri"],
          },
        },
      ],
    });

    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
};
