module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/.coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
  // setupFilesAfterEnv: ["<rootDir>/__jest__/setup.js"],
  // snapshotSerializers: ["enzyme-to-json/serializer"],
  moduleNameMapper: {
    "\\.module\\.css$": "identity-obj-proxy",
  },
  // Ref https://github.com/facebook/jest/issues/2070#issuecomment-431706685
  // Todo(steve): remove next line when issue fixed.
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
};
