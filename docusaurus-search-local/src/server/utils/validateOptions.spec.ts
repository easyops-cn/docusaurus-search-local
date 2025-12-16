import { Joi } from "@docusaurus/utils-validation";
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

  test.each<
    [
      PluginOptions | undefined,
      PluginOptions &
        Required<
          Omit<
            PluginOptions,
            | "docsPluginIdForPreferredVersion"
            | "zhUserDict"
            | "zhUserDictPath"
            | "searchContextByPaths"
          >
        >
    ]
  >([
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
        removeDefaultStopWordFilter: [],
        removeDefaultStemmer: false,
        hideSearchBarWithNoSearchContext: false,
        useAllContextsWithNoSearchContext: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 8,
        explicitSearchResultPath: false,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        ignoreCssSelectors: [],
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchBarShortcutKeymap: "mod+k",
        searchBarPosition: "auto",
        forceIgnoreNoIndex: false,
        fuzzyMatchingDistance: 1,
        synonyms: [],
        synonyms: [],
      },
    ],
    [
      { ignoreFiles: "file1" },
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
        removeDefaultStopWordFilter: [],
        removeDefaultStemmer: false,
        hideSearchBarWithNoSearchContext: false,
        useAllContextsWithNoSearchContext: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 8,
        explicitSearchResultPath: false,
        searchResultContextMaxLength: 50,
        ignoreFiles: "file1",
        ignoreCssSelectors: [],
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchBarShortcutKeymap: "mod+k",
        searchBarPosition: "auto",
        forceIgnoreNoIndex: false,
        fuzzyMatchingDistance: 1,
        synonyms: [],
        synonyms: [],
      },
    ],
    [
      { ignoreFiles: [/__meta__$/, "file1"] },
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
        removeDefaultStopWordFilter: [],
        removeDefaultStemmer: false,
        hideSearchBarWithNoSearchContext: false,
        useAllContextsWithNoSearchContext: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 8,
        explicitSearchResultPath: false,
        searchResultContextMaxLength: 50,
        ignoreFiles: [/__meta__$/, "file1"],
        ignoreCssSelectors: [],
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchBarShortcutKeymap: "mod+k",
        searchBarPosition: "auto",
        forceIgnoreNoIndex: false,
        fuzzyMatchingDistance: 1,
        synonyms: [],
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
        removeDefaultStopWordFilter: [],
        removeDefaultStemmer: false,
        hideSearchBarWithNoSearchContext: false,
        useAllContextsWithNoSearchContext: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 8,
        explicitSearchResultPath: false,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        ignoreCssSelectors: [],
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchBarShortcutKeymap: "mod+k",
        searchBarPosition: "auto",
        forceIgnoreNoIndex: false,
        fuzzyMatchingDistance: 1,
        synonyms: [],
      },
    ],
    [
      {
        docsDir: "src/docs",
        blogDir: "src/blog",
        language: "en",
        hideSearchBarWithNoSearchContext: false,
        useAllContextsWithNoSearchContext: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 5,
        explicitSearchResultPath: false,
        searchResultContextMaxLength: 30,
        searchBarShortcut: false,
        forceIgnoreNoIndex: true,
        fuzzyMatchingDistance: 0,
        synonyms: [],
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
        removeDefaultStopWordFilter: [],
        removeDefaultStemmer: false,
        hideSearchBarWithNoSearchContext: false,
        useAllContextsWithNoSearchContext: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 5,
        explicitSearchResultPath: false,
        searchResultContextMaxLength: 30,
        ignoreFiles: [],
        ignoreCssSelectors: [],
        searchBarShortcut: false,
        searchBarShortcutHint: true,
        searchBarShortcutKeymap: "mod+k",
        searchBarPosition: "auto",
        forceIgnoreNoIndex: true,
        fuzzyMatchingDistance: 0,
        synonyms: [],
      },
    ],
    [
      {
        docsRouteBasePath: "/dev/docs",
        blogRouteBasePath: "/dev/blog",
        searchBarShortcutHint: false,
        hashed: true,
      },
      {
        blogRouteBasePath: "/dev/blog",
        blogDir: ["blog"],
        docsRouteBasePath: "/dev/docs",
        docsDir: ["docs"],
        hashed: true,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en"],
        removeDefaultStopWordFilter: [],
        removeDefaultStemmer: false,
        hideSearchBarWithNoSearchContext: false,
        useAllContextsWithNoSearchContext: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 8,
        explicitSearchResultPath: false,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        ignoreCssSelectors: [],
        searchBarShortcut: true,
        searchBarShortcutHint: false,
        searchBarShortcutKeymap: "mod+k",
        searchBarPosition: "auto",
        forceIgnoreNoIndex: false,
        fuzzyMatchingDistance: 1,
        synonyms: [],
      },
    ],
    [
      {
        docsRouteBasePath: ["/dev/docs"],
        blogRouteBasePath: ["/dev/blog"],
        docsPluginIdForPreferredVersion: "product",
        hashed: "filename",
        searchBarPosition: "left",
        searchContextByPaths: ["docs", "community"],
        hideSearchBarWithNoSearchContext: true,
        useAllContextsWithNoSearchContext: false,
        removeDefaultStopWordFilter: true,
      },
      {
        blogRouteBasePath: ["/dev/blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["/dev/docs"],
        docsDir: ["docs"],
        hashed: "filename",
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en"],
        removeDefaultStopWordFilter: true,
        removeDefaultStemmer: false,
        hideSearchBarWithNoSearchContext: true,
        useAllContextsWithNoSearchContext: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 8,
        explicitSearchResultPath: false,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        ignoreCssSelectors: [],
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchBarShortcutKeymap: "mod+k",
        searchBarPosition: "left",
        docsPluginIdForPreferredVersion: "product",
        searchContextByPaths: ["docs", "community"],
        forceIgnoreNoIndex: false,
        fuzzyMatchingDistance: 1,
        synonyms: [],
      },
    ],
    [
      {
        docsRouteBasePath: ["/dev/docs"],
        blogRouteBasePath: ["/dev/blog"],
        docsPluginIdForPreferredVersion: "product",
        hashed: "filename",
        searchBarPosition: "left",
        searchContextByPaths: ["docs", "community"],
        useAllContextsWithNoSearchContext: true,
        removeDefaultStopWordFilter: ["en", "zh"],
      },
      {
        blogRouteBasePath: ["/dev/blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["/dev/docs"],
        docsDir: ["docs"],
        hashed: "filename",
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        language: ["en"],
        removeDefaultStopWordFilter: ["en", "zh"],
        removeDefaultStemmer: false,
        hideSearchBarWithNoSearchContext: false,
        useAllContextsWithNoSearchContext: true,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 8,
        explicitSearchResultPath: false,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        ignoreCssSelectors: [],
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchBarShortcutKeymap: "mod+k",
        searchBarPosition: "left",
        docsPluginIdForPreferredVersion: "product",
        searchContextByPaths: ["docs", "community"],
        forceIgnoreNoIndex: false,
        fuzzyMatchingDistance: 1,
        synonyms: [],
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

  test("should work with custom searchBarShortcutKeymap", () => {
    expect(validateOptions({ 
      options: { 
        searchBarShortcutKeymap: "s" 
      }, 
      validate 
    })).toEqual(expect.objectContaining({
      searchBarShortcutKeymap: "s",
    }));

    expect(validateOptions({ 
      options: { 
        searchBarShortcutKeymap: "ctrl+shift+f" 
      }, 
      validate 
    })).toEqual(expect.objectContaining({
      searchBarShortcutKeymap: "ctrl+shift+f",
    }));
  });
});
