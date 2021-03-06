import { EmptyTemplate } from "./EmptyTemplate";

jest.mock("../../utils/proxiedGenerated");

describe("EmptyTemplate", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });

  test("production", () => {
    process.env.NODE_ENV = "production";
    expect(EmptyTemplate()).toContain("No results");
  });

  test("development", () => {
    process.env.NODE_ENV = "development";
    expect(EmptyTemplate()).toContain("build");
  });
});
