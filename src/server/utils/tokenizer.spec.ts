import { MatchMetadata } from "../../shared/interfaces";
import { tokenizer } from "./tokenizer";

describe("tokenizer", () => {
  test.each<[string | string[] | null | undefined, MatchMetadata, any[]]>([
    [null, {}, []],
    [
      ["already", "tokenized"],
      {},
      [
        {
          str: "already",
          metadata: {},
        },
        {
          str: "tokenized",
          metadata: {},
        },
      ],
    ],
    [
      "api_gateway: 很好用。Good.",
      {},
      [
        {
          metadata: {
            index: 0,
            position: [0, 11],
          },
          str: "api_gateway",
        },
        {
          metadata: {
            index: 1,
            position: [0, 3],
          },
          str: "api",
        },
        {
          metadata: {
            index: 2,
            position: [4, 7],
          },
          str: "gateway",
        },
        {
          metadata: {
            index: 3,
            position: [13, 1],
          },
          str: "很",
        },
        {
          metadata: {
            index: 4,
            position: [14, 1],
          },
          str: "好",
        },
        {
          metadata: {
            index: 5,
            position: [15, 1],
          },
          str: "用",
        },
        {
          metadata: {
            index: 6,
            position: [17, 4],
          },
          str: "good",
        },
      ],
    ],
  ])(
    "tokenizer('%s', zhDictionary) should return %j",
    (input, metadata, tokens) => {
      expect(tokenizer(input, metadata)).toEqual(tokens);
    }
  );
});
