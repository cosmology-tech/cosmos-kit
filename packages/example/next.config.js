// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// const withTM = require("next-transpile-modules")(["@cosmos-kit/web3auth"]);

// /** @type {import('next').NextConfig} */
// module.exports = withTM(
//   withBundleAnalyzer({
//     reactStrictMode: true,
//     swcMinify: true,
//     webpack: (config) => {
//       config.module.rules.push({
//         test: /\.(ts|tsx)$/,
//         use: [
//           {
//             loader: "babel-loader",
//             options: {
//               presets: [
//                 "@babel/preset-env",
//                 ["@babel/preset-react", { runtime: "automatic" }],
//                 ["@babel/preset-typescript", { allowDeclareFields: true }],
//               ],
//               plugins: ["babel-plugin-inline-import-data-uri"],
//             },
//           },
//         ],
//       });

//       config.resolve.extensions.push(".ts", ".tsx");
//       return config;
//     },
//   })
// );
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@cosmos-kit/web3auth"],
  /**
   *
   * @param {import('webpack').Configuration} config
   * @param {import('next/dist/server/config-shared').WebpackConfigContext} _context
   * @returns {import('webpack').Configuration}
   */
  webpack: (config, _context) => {
    const overridePath = path.resolve(__dirname, "../..", "node_modules/react");
    config.resolve.alias["react"] = overridePath;
    return config;
  },
};

module.exports = nextConfig;
