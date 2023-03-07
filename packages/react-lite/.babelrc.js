const useESModules = !!process.env.MODULE;

module.exports = (api) => {
  api.cache(() => process.env.MODULE);
  return {
    plugins: [
      ['@babel/transform-runtime', { useESModules }],
      '@babel/proposal-object-rest-spread',
      '@babel/proposal-class-properties',
      '@babel/proposal-export-default-from'
    ],
    presets: useESModules
      ? ["@babel/preset-typescript", "@babel/preset-react"]
      : ["@babel/preset-typescript", "@babel/preset-env", "@babel/preset-react"],
  };
};
