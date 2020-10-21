import { PluginOptions, ProcessedPluginOptions } from "../../shared/interfaces";
import { processPluginOptions } from "./processPluginOptions";

describe("processPluginOptions", () => {
  const siteDir = "/tmp";

  test.each<[PluginOptions, ProcessedPluginOptions]>([
    [
      undefined,
      {
        blogRouteBasePath: "blog",
        blogDir: "/tmp/blog",
        docsRouteBasePath: "docs",
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
        blogRouteBasePath: "blog",
        blogDir: "/tmp/blog",
        docsRouteBasePath: "docs",
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
        blogRouteBasePath: "blog",
        blogDir: "/tmp/src/blog",
        docsRouteBasePath: "docs",
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
