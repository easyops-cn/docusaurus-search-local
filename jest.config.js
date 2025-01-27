module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "\\.[t|j]sx?$": "babel-jest",
  },
  clearMocks: true,
  testMatch: ["**/docusaurus-search-local/src/**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/.yarn/", "<rootDir>/website/", "searchByWorker"],
  collectCoverage: true,
  coverageDirectory: "<rootDir>/.coverage",
  collectCoverageFrom: ["docusaurus-search-local/src/**/*.{ts,tsx,js,jsx}", "!docusaurus-search-local/src/**/searchByWorker.*"],
  moduleNameMapper: {
    "\\.module\\.css$": require.resolve("identity-obj-proxy"),
    "@docusaurus/Translate": "<rootDir>/__mocks__/Translate.js",
    "^cheerio$": require.resolve("cheerio"),
  },
  // Ref https://github.com/facebook/jest/issues/2070#issuecomment-431706685
  // Todo(steve): remove next line when issue fixed.
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
  setupFilesAfterEnv: ["<rootDir>/jestSetup.js"],
};
