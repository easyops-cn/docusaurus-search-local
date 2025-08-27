import { buildIndex as _buildIndex } from "./buildIndex";
import {
  ProcessedPluginOptions,
  SearchDocument,
} from "../../shared/interfaces";

describe("buildIndex", () => {
  const allDocuments: Partial<SearchDocument>[][] = [
    [
      {
        i: 1,
        t: "Hello World if any",
      },
      {
        i: 2,
        t: "你好世界",
      },
      {
        i: 3,
        t: "Hola Mundo",
      },
      {
        i: 4,
        t: "私は電車が好きです。",
      },
    ],
  ];
  let buildIndex: typeof _buildIndex;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    buildIndex = require("./buildIndex").buildIndex;
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('should work for ["en"]', () => {
    const wrappedIndexes = buildIndex(
      allDocuments as SearchDocument[][],
      {
        language: ["en"],
        removeDefaultStopWordFilter: [] as string[],
        removeDefaultStemmer: false,
        synonyms: [],
      } as ProcessedPluginOptions
    );

    expect(wrappedIndexes[0].index.search("世界")).toEqual([]);
    expect(wrappedIndexes[0].index.search("if")).toEqual([]);
    expect(wrappedIndexes[0].index.search("hello")).toEqual([
      expect.objectContaining({
        ref: "1",
        matchData: {
          metadata: {
            hello: {
              t: {
                position: [[0, 5]],
              },
            },
          },
        },
      }),
    ]);
  });

  test('should work for ["zh"]', () => {
    const wrappedIndexes = buildIndex(
      allDocuments as SearchDocument[][],
      {
        language: ["zh"],
        removeDefaultStopWordFilter: [] as string[],
        removeDefaultStemmer: false,
        synonyms: [],
      } as ProcessedPluginOptions
    );

    expect(wrappedIndexes[0].index.search("hello")).toEqual([]);
    expect(wrappedIndexes[0].index.search("if")).toEqual([]);
    expect(wrappedIndexes[0].index.search("世界")).toEqual([
      expect.objectContaining({
        ref: "2",
      }),
    ]);
  });

  test('should work for ["es"]', () => {
    const wrappedIndexes = buildIndex(
      allDocuments as SearchDocument[][],
      {
        language: ["es"],
        removeDefaultStopWordFilter: [] as string[],
        removeDefaultStemmer: false,
        synonyms: [],
      } as ProcessedPluginOptions
    );

    expect(wrappedIndexes[0].index.search("世界")).toEqual([]);
    expect(wrappedIndexes[0].index.search("hola")).toEqual([
      expect.objectContaining({
        ref: "3",
      }),
    ]);
  });

  test('should work for ["ja"]', () => {
    const wrappedIndexes = buildIndex(
      allDocuments as SearchDocument[][],
      {
        language: ["ja"],
        removeDefaultStopWordFilter: [] as string[],
        removeDefaultStemmer: false,
        synonyms: [],
      } as ProcessedPluginOptions
    );

    expect(wrappedIndexes[0].index.search("hello")).toEqual([
      expect.objectContaining({
        ref: "1",
      }),
    ]);
    expect(wrappedIndexes[0].index.search("世界")).toEqual([
      expect.objectContaining({
        ref: "2",
      }),
    ]);
    expect(wrappedIndexes[0].index.search("hola")).toEqual([
      expect.objectContaining({
        ref: "3",
      }),
    ]);
    expect(wrappedIndexes[0].index.search("好き")).toEqual([
      expect.objectContaining({
        ref: "4",
      }),
    ]);
  });

  test('should work for ["en", "zh]', () => {
    const wrappedIndexes = buildIndex(
      allDocuments as SearchDocument[][],
      {
        language: ["en", "zh"],
        removeDefaultStopWordFilter: ["en"],
        removeDefaultStemmer: false,
        synonyms: [],
      } as ProcessedPluginOptions
    );

    expect(wrappedIndexes[0].index.search("hello")).toEqual([
      expect.objectContaining({
        ref: "1",
      }),
    ]);
    expect(wrappedIndexes[0].index.search("if")).toEqual([
      expect.objectContaining({
        ref: "1",
      }),
    ]);
    expect(wrappedIndexes[0].index.search("世界")).toEqual([
      expect.objectContaining({
        ref: "2",
      }),
    ]);
  });

  test("should work with synonyms", () => {
    const synonymsTestDocuments: Partial<SearchDocument>[][] = [
      [
        {
          i: 1,
          t: "CSS tutorial guide",
        },
        {
          i: 2,
          t: "JavaScript manual",
        },
        {
          i: 3,
          t: "Modern styles implementation",
        },
      ],
    ];

    const wrappedIndexes = buildIndex(
      synonymsTestDocuments as SearchDocument[][],
      {
        language: ["en"],
        removeDefaultStopWordFilter: [] as string[],
        removeDefaultStemmer: false,
        synonyms: [["CSS", "styles"], ["JavaScript", "JS"]],
      } as ProcessedPluginOptions
    );

    // Without synonyms expansion in query, search should work for original terms
    const cssResults = wrappedIndexes[0].index.search("CSS");
    expect(cssResults.length).toBe(1);
    expect(cssResults[0].ref).toBe("1");

    const stylesResults = wrappedIndexes[0].index.search("styles");
    expect(stylesResults.length).toBe(1);
    expect(stylesResults[0].ref).toBe("3");

    // Test that query expansion would find both (this mimics client-side behavior)
    const synonymsQuery = "CSS OR styles";
    const expandedResults = wrappedIndexes[0].index.search(synonymsQuery);
    expect(expandedResults.length).toBe(2);
    expect(expandedResults.map(r => r.ref)).toContain("1");
    expect(expandedResults.map(r => r.ref)).toContain("3");
  });
});
