const useESModules = !!process.env.MODULE;

module.exports = (api) => {
  api.cache(() => process.env.MODULE);
  return {
    plugins: [
      ['@babel/transform-runtime', { useESModules }],
      '@babel/proposal-object-rest-spread',
      '@babel/proposal-class-properties',
      '@babel/proposal-export-default-from',
      'inline-import-data-uri',
      'babel-plugin-transform-import-meta'
    ],
    presets: useESModules
      ? ["@babel/typescript", "@babel/react"]
      : ["@babel/typescript", "@babel/env", "@babel/react"],
  };
};
