/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        babelConfig: false,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  transformIgnorePatterns: [`/node_modules/*`],
  testRegex: "(/starship/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testTimeout: 15000,
  modulePathIgnorePatterns: [
    "dist/*",
    "__tests__/*",
  ]
};
