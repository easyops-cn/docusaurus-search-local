import { tokenize } from "./tokenize";

describe("tokenize", () => {
  test.each<[string, string[]]>([
    ["Hello World", ["hello", "world"]],
    ["Hello World 「世界和平」", ["hello", "world", "世界和平"]],
    [
      "a1b2很好c3_d4更好56也好，不错。",
      ["a1b2", "很好", "c3_d4", "更好", "56", "也好", "不错"],
    ],
    ["...", []],
  ])("tokenize('%s') should return %j", (text, tokens) => {
    expect(tokenize(text)).toEqual(tokens);
  });
});
