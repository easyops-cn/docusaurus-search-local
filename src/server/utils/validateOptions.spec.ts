import Joi from "@hapi/joi";
import { PluginOptions } from "../../shared/interfaces";
import { validateOptions } from "./validateOptions";

describe("validateOptions", () => {
  function validate(
    schema: Joi.Schema,
    options: PluginOptions | undefined
  ): Required<PluginOptions> {
    const { error, value } = schema.validate(options, {
      convert: false,
    });
    if (error) {
      throw error;
    }
    return value;
  }

  test.each<[PluginOptions | undefined, Required<PluginOptions>]>([
    [
      undefined,
      {
        blogRouteBasePath: ["blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["docs"],
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en"],
        removeDefaultStopWordFilter: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      },
    ],
    [
      { language: ["en", "zh"] },
      {
        blogRouteBasePath: ["blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["docs"],
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en", "zh"],
        removeDefaultStopWordFilter: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      },
    ],
    [
      {
        docsDir: "src/docs",
        blogDir: "src/blog",
        language: "en",
        searchResultLimits: 5,
        searchResultContextMaxLength: 30,
      },
      {
        blogRouteBasePath: ["blog"],
        blogDir: "src/blog",
        docsRouteBasePath: ["docs"],
        docsDir: "src/docs",
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: "en",
        removeDefaultStopWordFilter: false,
        searchResultLimits: 5,
        searchResultContextMaxLength: 30,
      },
    ],
    [
      {
        docsRouteBasePath: "/dev/docs",
        blogRouteBasePath: "/dev/blog",
      },
      {
        blogRouteBasePath: "/dev/blog",
        blogDir: ["blog"],
        docsRouteBasePath: "/dev/docs",
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en"],
        removeDefaultStopWordFilter: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      },
    ],
    [
      {
        docsRouteBasePath: ["/dev/docs"],
        blogRouteBasePath: ["/dev/blog"],
      },
      {
        blogRouteBasePath: ["/dev/blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["/dev/docs"],
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en"],
        removeDefaultStopWordFilter: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      },
    ],
  ])("validateOptions(...) should work", (options, config) => {
    expect(validateOptions({ options, validate })).toEqual(config);
  });

  test("should throw error if options are invalid", () => {
    expect(() => {
      validateOptions({
        options: {
          docsBasePath: "docs",
        } as PluginOptions,
        validate,
      });
    }).toThrow();
  });
});
