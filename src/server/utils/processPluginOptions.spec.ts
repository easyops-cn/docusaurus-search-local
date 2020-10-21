import { PluginOptions, ProcessedPluginOptions } from "../../shared/interfaces";
import { processPluginOptions } from "./processPluginOptions";

describe("processPluginOptions", () => {
  const siteDir = "/tmp";

  test.each<[PluginOptions, ProcessedPluginOptions]>([
    [
      undefined,
      {
        blogBasePath: "blog",
        blogDir: "/tmp/blog",
        docsBasePath: "docs",
        docsDir: "/tmp/docs",
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en"],
        removeDefaultStopWordFilter: false,
      },
    ],
    [
      { language: ["en", "zh"] },
      {
        blogBasePath: "blog",
        blogDir: "/tmp/blog",
        docsBasePath: "docs",
        docsDir: "/tmp/docs",
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en", "zh"],
        removeDefaultStopWordFilter: false,
      },
    ],
    [
      {
        docsDir: "src/docs",
        blogDir: "src/blog",
      },
      {
        blogBasePath: "blog",
        blogDir: "/tmp/src/blog",
        docsBasePath: "docs",
        docsDir: "/tmp/src/docs",
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en"],
        removeDefaultStopWordFilter: false,
      },
    ],
  ])("processPluginOptions(...) should work", (options, config) => {
    expect(processPluginOptions(options, siteDir)).toEqual(config);
  });
});
