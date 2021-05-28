import {
  DocInfoWithFilePath,
  PostBuildData,
  ProcessedPluginOptions,
} from "../../shared/interfaces";
import { processDocInfos } from "./processDocInfos";

describe("processDocInfos", () => {
  const routesPaths: string[] = [
    "/base/",
    "/base/docs/a",
    "/base/blog",
    "/base/blog/tags",
    "/base/blog/b",
    "/base/404.html",
    "/base/page",
    "/base/__meta__.md",
    "/base/file.md",
  ];
  const buildData: PostBuildData = {
    routesPaths,
    outDir: "/build",
    baseUrl: "/base/",
  };
  test.each<[Partial<ProcessedPluginOptions>, DocInfoWithFilePath[]]>([
    [
      {
        indexDocs: false,
        indexBlog: false,
        indexPages: false,
        ignoreFiles: [],
      },
      [],
    ],
    [
      {
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: ["docs"],
        blogRouteBasePath: ["blog"],
        ignoreFiles: [/^__meta__/, "file.md"],
      },
      [
        {
          filePath: "/build/index.html",
          type: "page",
          url: "/base/",
        },
        {
          filePath: "/build/docs/a/index.html",
          type: "docs",
          url: "/base/docs/a",
        },
        {
          filePath: "/build/blog/b/index.html",
          type: "blog",
          url: "/base/blog/b",
        },
        {
          filePath: "/build/page/index.html",
          type: "page",
          url: "/base/page",
        },
      ],
    ],
  ])("processDocInfos(...) should work", (config, result) => {
    expect(
      processDocInfos(buildData, config as ProcessedPluginOptions)
    ).toEqual(result);
  });
});
