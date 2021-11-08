import { PluginOptions, ProcessedPluginOptions } from "../../shared/interfaces";
import { processPluginOptions } from "./processPluginOptions";

describe("processPluginOptions", () => {
  const siteDir = "/tmp";

  test.each<[PluginOptions, Partial<ProcessedPluginOptions>]>([
    [
      {
        docsRouteBasePath: "docs",
        blogRouteBasePath: "/blog",
        docsDir: "docs",
        blogDir: "blog",
        language: "en",
        ignoreFiles: "test",
      },
      {
        docsRouteBasePath: ["docs"],
        blogRouteBasePath: ["blog"],
        blogDir: ["/tmp/blog"],
        docsDir: ["/tmp/docs"],
        language: ["en"],
        ignoreFiles: ["test"],
      },
    ],
    [
      {
        docsRouteBasePath: ["docs"],
        blogRouteBasePath: ["/blog"],
        docsDir: "docs",
        blogDir: "blog",
        language: ["en", "zh"],
        ignoreFiles: [/__meta__$/],
      },
      {
        docsRouteBasePath: ["docs"],
        blogRouteBasePath: ["blog"],
        blogDir: ["/tmp/blog"],
        docsDir: ["/tmp/docs"],
        language: ["en", "zh"],
        ignoreFiles: [/__meta__$/],
      },
    ],
  ])("processPluginOptions(...) should work", (options, config) => {
    expect(processPluginOptions(options, siteDir)).toEqual(config);
  });
});
