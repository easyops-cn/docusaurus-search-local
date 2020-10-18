module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  collectCoverage: true,
  coverageDirectory: "<rootDir>/.coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
  // setupFilesAfterEnv: ["<rootDir>/__jest__/setup.js"],
  // snapshotSerializers: ["enzyme-to-json/serializer"],
};
