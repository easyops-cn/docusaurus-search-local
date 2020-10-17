import { SmartQuery } from "../../shared/interfaces";
import { smartQueries } from "./smartQueries";

const zhDictionary = ["研究生", "研究", "生命", "科学", "生命科学"];

describe("smartQueries", () => {
  test.each<[string[], SmartQuery[]]>([
    [
      ["hello"],
      [
        {
          tokens: ["hello"],
          keyword: "+hello",
        },
        {
          tokens: ["hello"],
          keyword: "+hello*",
        },
      ],
    ],
    [
      ["hello", "world"],
      [
        {
          tokens: ["hello", "world"],
          keyword: "+hello +world",
        },
        {
          tokens: ["hello", "world"],
          keyword: "+hello +world*",
        },
      ],
    ],
    [
      ["hello", "world", "研究生命科学"],
      [
        {
          tokens: ["hello", "world", "研究", "生命科学"],
          keyword: "+hello +world +研究 +生命科学",
        },
        {
          tokens: ["hello", "world", "研究", "生命", "科学"],
          keyword: "+hello +world +研究 +生命 +科学",
        },
        {
          tokens: ["hello", "world", "研究生", "科学"],
          keyword: "+hello +world +研究生 +科学",
        },
        {
          tokens: ["hello", "world", "研究", "生命科学"],
          keyword: "+hello +world +研究 +生命科学*",
        },
        {
          tokens: ["hello", "world", "研究", "生命", "科学"],
          keyword: "+hello +world +研究 +生命 +科学*",
        },
        {
          tokens: ["hello", "world", "研究生", "科学"],
          keyword: "+hello +world +研究生 +科学*",
        },
      ],
    ],
    [
      ["hello", "world", "研究生"],
      [
        {
          tokens: ["hello", "world", "研究生"],
          keyword: "+hello +world +研究生",
        },
        {
          tokens: ["hello", "world", "研究", "生"],
          keyword: "+hello +world +研究 +生*",
        },
        {
          tokens: ["hello", "world", "研究生"],
          keyword: "+hello +world +研究生*",
        },
      ],
    ],
    [
      ["hello", "world", "生命科学", "研究生"],
      [
        {
          tokens: ["hello", "world", "生命科学", "研究生"],
          keyword: "+hello +world +生命科学 +研究生",
        },
        {
          tokens: ["hello", "world", "生命科学", "研究", "生"],
          keyword: "+hello +world +生命科学 +研究 +生*",
        },
        {
          tokens: ["hello", "world", "生命", "科学", "研究生"],
          keyword: "+hello +world +生命 +科学 +研究生",
        },
        {
          tokens: ["hello", "world", "生命", "科学", "研究", "生"],
          keyword: "+hello +world +生命 +科学 +研究 +生*",
        },
        {
          tokens: ["hello", "world", "生命科学", "研究生"],
          keyword: "+hello +world +生命科学 +研究生*",
        },
        {
          tokens: ["hello", "world", "生命", "科学", "研究生"],
          keyword: "+hello +world +生命 +科学 +研究生*",
        },
      ],
    ],
    [
      ["hello", "world", "命"],
      [
        {
          tokens: ["hello", "world", "命"],
          keyword: "+*hello* +*world* +*命*",
        },
      ],
    ],
  ])("smartQueries(%j, zhDictionary) should return %j", (tokens, queries) => {
    expect(smartQueries(tokens, zhDictionary)).toEqual(queries);
  });
});
