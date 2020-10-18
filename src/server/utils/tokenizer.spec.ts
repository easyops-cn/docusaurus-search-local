import nodejieba from "nodejieba";
import { MatchMetadata } from "../../shared/interfaces";
import { tokenizer } from "./tokenizer";

jest.mock("nodejieba");
(nodejieba.cut as jest.MockedFunction<typeof nodejieba.cut>).mockImplementation(
  (input) => {
    return [input.substr(0, 2), input.substr(2)];
  }
);

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
            position: [13, 2],
          },
          str: "很好",
        },
        {
          metadata: {
            index: 4,
            position: [15, 1],
          },
          str: "用",
        },
        {
          metadata: {
            index: 5,
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
