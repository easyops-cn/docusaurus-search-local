import { DocusaurusConfig } from "@docusaurus/types";
import {
  DocInfoWithFilePath,
  PostBuildData,
  ProcessedPluginOptions,
} from "../../shared/interfaces";
import { processDocInfos } from "./processDocInfos";

describe("processDocInfos", () => {
  describe("trailingSlash defaults to undefined", () => {
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
      siteConfig: {} as DocusaurusConfig,
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

  describe("trailingSlash set to false", () => {
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
      siteConfig: {
        trailingSlash: false,
      } as DocusaurusConfig,
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
            filePath: "/build/docs/a.html",
            type: "docs",
            url: "/base/docs/a",
          },
          {
            filePath: "/build/blog/b.html",
            type: "blog",
            url: "/base/blog/b",
          },
          {
            filePath: "/build/page.html",
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

  describe("trailingSlash set to true", () => {
    const routesPaths: string[] = [
      "/base/",
      "/base/docs/a/",
      "/base/blog/",
      "/base/blog/tags/",
      "/base/blog/b/",
      "/base/404.html",
      "/base/page/",
      "/base/__meta__.md",
      "/base/file.md",
    ];
    const buildData: PostBuildData = {
      routesPaths,
      outDir: "/build",
      baseUrl: "/base/",
      siteConfig: {
        trailingSlash: true,
      } as DocusaurusConfig,
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
            filePath: "/build/docs/a/index.html",
            type: "docs",
            url: "/base/docs/a/",
          },
          {
            filePath: "/build/blog/b/index.html",
            type: "blog",
            url: "/base/blog/b/",
          },
          {
            filePath: "/build/page/index.html",
            type: "page",
            url: "/base/page/",
          },
        ],
      ],
    ])("processDocInfos(...) should work", (config, result) => {
      expect(
        processDocInfos(buildData, config as ProcessedPluginOptions)
      ).toEqual(result);
    });
  });
});
