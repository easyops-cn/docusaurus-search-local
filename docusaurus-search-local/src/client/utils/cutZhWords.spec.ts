import { cutZhWords } from "./cutZhWords";

const zhDictionary = ["研究生", "研究", "生命", "科学", "生命科学"];

describe("cutZhWords", () => {
  test.each<[string, string[][]]>([
    [
      "研究生命科学",
      [
        ["研究", "生命科学"],
        ["研究", "生命", "科学"],
        ["研究生", "科学"],
      ],
    ],
    [
      "研究生命科",
      [
        ["研究", "生命科*"],
        ["研究", "生命", "科*"],
        ["研究生", "科*"],
      ],
    ],
    ["研究生", [["研究生"], ["研究", "生*"]]],
    [
      "研究生科",
      [
        ["研究生", "科*"],
        ["研究", "生*", "科*"],
      ],
    ],
    ["我研究生", [["研究生"], ["研究", "生*"]]],
    ["研究生我", [["研究生"], ["研究", "生*"]]],
    ["我", []],
    ["命", []],
  ])("cutZhWords('%s', zhDictionary) should work", (token, terms) => {
    expect(
      cutZhWords(token, zhDictionary).map((term) =>
        term.map((item) => `${item.value}${item.trailing ? "*" : ""}`)
      )
    ).toEqual(terms);
  });
});
