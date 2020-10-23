import {
  MetadataPosition,
  ChunkIndexRef,
  HighlightChunk,
} from "../../shared/interfaces";
import { highlightStemmed, splitIntoChunks } from "./highlightStemmed";

jest.mock("./proxiedGenerated");

describe("highlightStemmed", () => {
  test.each<[string, MetadataPosition[], string[], number | undefined, string]>(
    [
      [
        "I Have A Dream. And the dream comes true",
        //1   5    0    5    0    5    0    5    0
        [
          [9, 5], // dream
          [24, 5], // dream
          [36, 4], // true
        ],
        ["dream", "true"],
        undefined,
        "I Have A <mark>Dream</mark>. And the <mark>dream</mark> comes <mark>true</mark>",
      ],
      [
        "I Have A Dream. And the dream comes true",
        //1   5    0    5    0    5    0    5    0
        [
          [9, 5], // dream
          [24, 5], // dream
          [36, 4], // true
        ],
        ["dream", "true"],
        16,
        "… A <mark>Dream</mark>. And …",
      ],
    ]
  )(
    "highlightStemmed('%s', %j, %j, %j) should return '%s'",
    (text, positions, tokens, maxLength, result) => {
      expect(highlightStemmed(text, positions, tokens, maxLength)).toEqual(
        result
      );
    }
  );
});

describe("splitIntoChunks", () => {
  test.each<[string, MetadataPosition[], string[], HighlightChunk[], number]>([
    [
      "I Have A Dream. And the dream comes true.<br />",
      //1   5    10   15   20   25   30   35   40
      [
        [9, 5], // dream
        [12, 2], // am
        [24, 5], // dream
        [27, 2], // am
        [36, 4], // true
      ],
      ["dream", "true", "am"],
      [
        {
          html: "I",
          textLength: 1,
        },
        {
          html: " ",
          textLength: 1,
        },
        {
          html: "Have",
          textLength: 4,
        },
        {
          html: " ",
          textLength: 1,
        },
        {
          html: "A",
          textLength: 1,
        },
        {
          html: " ",
          textLength: 1,
        },
        {
          html: "<mark>Dream</mark>",
          textLength: 5,
        },
        {
          html: ". ",
          textLength: 2,
        },
        {
          html: "And",
          textLength: 3,
        },
        {
          html: " ",
          textLength: 1,
        },
        {
          html: "the",
          textLength: 3,
        },
        {
          html: " ",
          textLength: 1,
        },
        {
          html: "<mark>dream</mark>",
          textLength: 5,
        },
        {
          html: " ",
          textLength: 1,
        },
        {
          html: "comes",
          textLength: 5,
        },
        {
          html: " ",
          textLength: 1,
        },
        {
          html: "<mark>true</mark>",
          textLength: 4,
        },
        {
          html: ".&lt;",
          textLength: 2,
        },
        {
          html: "br",
          textLength: 2,
        },
        {
          html: " /&gt;",
          textLength: 3,
        },
      ],
      6,
    ],
    [
      "研究生",
      [
        [0, 3],
        [0, 2],
      ],
      ["研究生", "研究"],
      [
        {
          html: "<mark>研究生</mark>",
          textLength: 3,
        },
      ],
      0,
    ],
  ])(
    "splitIntoChunks('%s', %j, %j, 0, 0) should return %j",
    (text, positions, tokens, chunks, chunkIndex) => {
      const chunkIndexRef = {} as ChunkIndexRef;
      expect(
        splitIntoChunks(text, positions, tokens, 0, 0, chunkIndexRef)
      ).toEqual(chunks);
      expect(chunkIndexRef.chunkIndex).toBe(chunkIndex);
    }
  );
});
