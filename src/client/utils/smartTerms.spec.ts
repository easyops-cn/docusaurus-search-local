import { SmartTerm } from "../../shared/interfaces";
import { smartTerms } from "./smartTerms";

const zhDictionary = ["研究生", "研究", "生命", "科学", "生命科学"];

describe("smartTerms", () => {
  test.each<[string[], SmartTerm[]]>([
    [["hello"], [["hello"]]],
    [["hello", "world"], [["hello", "world"]]],
    [
      ["hello", "world", "研究生命科学"],
      [
        ["hello", "world", "研究", "生命科学"],
        ["hello", "world", "研究", "生命", "科学"],
        ["hello", "world", "研究生", "科学"],
      ],
    ],
    [
      ["生命科学", "研究生"],
      [
        ["生命科学", "研究生"],
        ["生命科学", "研究", "生*"],
        ["生命", "科学", "研究生"],
        ["生命", "科学", "研究", "生*"],
      ],
    ],
    [["hello", "world", "命"], []],
    [["alfabetização"], [["alfabetização"]]],
  ])("smartTerms(%j, zhDictionary) should return %j", (tokens, queries) => {
    expect(smartTerms(tokens, zhDictionary)).toEqual(queries);
  });
});
