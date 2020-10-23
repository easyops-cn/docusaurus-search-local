import { PluginOptions, ProcessedPluginOptions } from "../../shared/interfaces";
import { processPluginOptions } from "./processPluginOptions";

describe("processPluginOptions", () => {
  const siteDir = "/tmp";

  test.each<[PluginOptions, Partial<ProcessedPluginOptions>]>([
    [
      {
        docsDir: "docs",
        blogDir: "blog",
        language: "en",
      },
      {
        blogDir: "/tmp/blog",
        docsDir: "/tmp/docs",
        language: ["en"],
      },
    ],
    [
      {
        docsDir: "docs",
        blogDir: "blog",
        language: ["en", "zh"],
      },
      {
        blogDir: "/tmp/blog",
        docsDir: "/tmp/docs",
        language: ["en", "zh"],
      },
    ],
  ])("processPluginOptions(...) should work", (options, config) => {
    expect(processPluginOptions(options, siteDir)).toEqual(config);
  });
});
