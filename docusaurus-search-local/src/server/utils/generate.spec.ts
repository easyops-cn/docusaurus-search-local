import fs from "fs";
import { getIndexHash } from "./getIndexHash";
import { generate } from "./generate";
import { ProcessedPluginOptions } from "../../shared/interfaces";

jest.mock("./getIndexHash");

const mockWriteFileSync = jest
  .spyOn(fs, "writeFileSync")
  .mockImplementation(() => void 0);

(getIndexHash as jest.MockedFunction<typeof getIndexHash>).mockReturnValue(
  "abc"
);

describe("generate", () => {
  test.each<[string[], any[]]>([
    [
      ["en"],
      [
        "export const removeDefaultStemmer = false;",
        "export const Mark = null;",
        "export const searchResultContextMaxLength = 50;",
        "export const explicitSearchResultPath = false;",
        "export const searchBarShortcut = true;",
        "export const searchBarShortcutHint = true;",
        'export const searchBarPosition = "auto";',
        "export const docsPluginIdForPreferredVersion = undefined;",
        "export const indexDocs = true;",
        "export const searchContextByPaths = null;",
        "export const hideSearchBarWithNoSearchContext = false;",
        "export const useAllContextsWithNoSearchContext = false;",
      ],
    ],
    [
      ["zh"],
      [
        "export const removeDefaultStemmer = false;",
        "export const Mark = null;",
        "export const searchResultContextMaxLength = 50;",
        "export const explicitSearchResultPath = false;",
        "export const searchBarShortcut = true;",
        "export const searchBarShortcutHint = true;",
        'export const searchBarPosition = "auto";',
        "export const docsPluginIdForPreferredVersion = undefined;",
        "export const indexDocs = true;",
        "export const searchContextByPaths = null;",
        "export const hideSearchBarWithNoSearchContext = false;",
        "export const useAllContextsWithNoSearchContext = false;",
      ],
    ],
    [
      ["es"],
      [
        "export const removeDefaultStemmer = false;",
        "export const Mark = null;",
        "export const searchResultContextMaxLength = 50;",
        "export const explicitSearchResultPath = false;",
        "export const searchBarShortcut = true;",
        "export const searchBarShortcutHint = true;",
        'export const searchBarPosition = "auto";',
        "export const docsPluginIdForPreferredVersion = undefined;",
        "export const indexDocs = true;",
        "export const searchContextByPaths = null;",
        "export const hideSearchBarWithNoSearchContext = false;",
        "export const useAllContextsWithNoSearchContext = false;",
      ],
    ],
    [
      ["ja"],
      [
        "export const removeDefaultStemmer = false;",
        "export const Mark = null;",
        "export const searchResultContextMaxLength = 50;",
        "export const explicitSearchResultPath = false;",
        "export const searchBarShortcut = true;",
        "export const searchBarShortcutHint = true;",
        'export const searchBarPosition = "auto";',
        "export const docsPluginIdForPreferredVersion = undefined;",
        "export const indexDocs = true;",
        "export const searchContextByPaths = null;",
        "export const hideSearchBarWithNoSearchContext = false;",
        "export const useAllContextsWithNoSearchContext = false;",
      ],
    ],
    [
      ["en", "zh"],
      [
        "export const removeDefaultStemmer = false;",
        "export const Mark = null;",
        "export const searchResultContextMaxLength = 50;",
        "export const explicitSearchResultPath = false;",
        "export const searchBarShortcut = true;",
        "export const searchBarShortcutHint = true;",
        'export const searchBarPosition = "auto";',
        "export const docsPluginIdForPreferredVersion = undefined;",
        "export const indexDocs = true;",
        "export const searchContextByPaths = null;",
        "export const hideSearchBarWithNoSearchContext = false;",
        "export const useAllContextsWithNoSearchContext = false;",
      ],
    ],
    [
      ["en", "es", "zh"],
      [
        "export const removeDefaultStemmer = false;",
        "export const Mark = null;",
        "export const searchResultContextMaxLength = 50;",
        "export const explicitSearchResultPath = false;",
        "export const searchBarShortcut = true;",
        "export const searchBarShortcutHint = true;",
        'export const searchBarPosition = "auto";',
        "export const docsPluginIdForPreferredVersion = undefined;",
        "export const indexDocs = true;",
        "export const searchContextByPaths = null;",
        "export const hideSearchBarWithNoSearchContext = false;",
        "export const useAllContextsWithNoSearchContext = false;",
      ],
    ],
  ])("generate({ language: %j }, dir) should work", (language, contents) => {
    generate(
      {
        language,
        removeDefaultStopWordFilter: false,
        removeDefaultStemmer: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        explicitSearchResultPath: false,
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchBarPosition: "auto",
        indexDocs: true,
      } as ProcessedPluginOptions,
      "/tmp"
    );
    expect(mockWriteFileSync).toBeCalledWith(
      expect.toMatchPath("/tmp/generated.js"),
      expect.any(String)
    );
    const calledContents = (mockWriteFileSync.mock.calls[0][1] as string).split(
      "\n"
    );
    expect(calledContents).toEqual(contents);
  });

  test("highlightSearchTermsOnTargetPage", () => {
    generate(
      {
        language: ["en"],
        removeDefaultStopWordFilter: false,
        removeDefaultStemmer: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        explicitSearchResultPath: false,
      } as ProcessedPluginOptions,
      "/tmp"
    );

    expect(mockWriteFileSync).toBeCalledWith(
      expect.toMatchPath("/tmp/generated.js"),
      expect.stringContaining("export { default as Mark } from")
    );
  });

  test("searchBarShortcut", () => {
    generate(
      {
        language: ["en"],
        removeDefaultStopWordFilter: false,
        searchBarShortcut: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      } as ProcessedPluginOptions,
      "/tmp"
    );

    expect(mockWriteFileSync).toBeCalledWith(
      expect.toMatchPath("/tmp/generated.js"),
      expect.stringContaining("export const searchBarShortcut = false")
    );
  });

  test("searchBarShortcutHint", () => {
    generate(
      {
        language: ["en"],
        removeDefaultStopWordFilter: false,
        searchBarShortcutHint: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      } as ProcessedPluginOptions,
      "/tmp"
    );

    expect(mockWriteFileSync).toBeCalledWith(
      expect.toMatchPath("/tmp/generated.js"),
      expect.stringContaining("export const searchBarShortcutHint = false")
    );
  });

  test("docsPluginIdForPreferredVersion", () => {
    generate(
      {
        language: ["en"],
        removeDefaultStopWordFilter: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        docsPluginIdForPreferredVersion: "product",
      } as ProcessedPluginOptions,
      "/tmp"
    );

    expect(mockWriteFileSync).toBeCalledWith(
      expect.toMatchPath("/tmp/generated.js"),
      expect.stringContaining(
        'export const docsPluginIdForPreferredVersion = "product"'
      )
    );
  });

  test("hashed with filename", () => {
    generate(
      {
        language: ["en"],
        removeDefaultStopWordFilter: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        hashed: "filename",
      } as ProcessedPluginOptions,
      "/tmp"
    );

    expect(mockWriteFileSync).toBeCalledWith(
      expect.toMatchPath("/tmp/generated.js"),
      expect.stringContaining("export const Mark = null;")
    );
  });

  test("fuzzy matching distance", () => {
    generate(
      {
        language: ["en"],
        removeDefaultStopWordFilter: false,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        fuzzyMatchingDistance: 2,
      } as ProcessedPluginOptions,
      "/tmp"
    );

    expect(mockWriteFileSync).toBeCalledWith(
      expect.toMatchPath("/tmp/generated-constants.js"),
      expect.stringContaining("export const fuzzyMatchingDistance = 2;")
    );
  });
});
