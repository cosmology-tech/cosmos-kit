const useESModules = !!process.env.MODULE;

module.exports = (api) => {
  api.cache(() => process.env.MODULE);
  return {
    presets: useESModules
      ? [["@babel/preset-typescript", { allowDeclareFields: true }]]
      : [["@babel/preset-typescript", { allowDeclareFields: true }], "@babel/preset-env"],
    plugins: [
      ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
      ['@babel/transform-runtime', { useESModules }],
      '@babel/proposal-object-rest-spread',
      '@babel/proposal-class-properties',
      '@babel/proposal-export-default-from'
    ],
  };
};
