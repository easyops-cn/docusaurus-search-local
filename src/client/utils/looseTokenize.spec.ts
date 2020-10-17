import { looseTokenize } from "./looseTokenize";

describe("looseTokenize", () => {
  test.each<[string, string[]]>([
    ["I have a 梦想。", ["I", " ", "have", " ", "a", " ", "梦", "想", "。"]],
  ])("looseTokenize('%s') should return %j", (content, tokens) => {
    expect(looseTokenize(content)).toEqual(tokens);
  });
});
