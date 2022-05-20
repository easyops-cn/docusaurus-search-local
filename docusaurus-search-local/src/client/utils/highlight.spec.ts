import { highlight } from "./highlight";

describe("highlight", () => {
  test.each<[string, string[], boolean, string]>([
    [
      "I Have A Dream. And the dream comes true",
      ["dream", "have", "true", "i"],
      false,
      "<mark>I</mark> <mark>Have</mark> A <mark>Dream</mark>. And the <mark>dream</mark> comes <mark>true</mark>",
    ],
    [
      "<b>The</b> dream comes <em>true</em>",
      ["dream"],
      false,
      "&lt;b&gt;The&lt;/b&gt; <mark>dream</mark> comes &lt;em&gt;true&lt;/em&gt;",
    ],
    [
      "query jQuery",
      ["jquery", "query"],
      false,
      "<mark>query</mark> <mark>jQuery</mark>",
    ],
    ["dream", ["dreams"], true, "<mark>dream</mark>"],
    ["<b>dream</b>", ["dreams"], true, "<mark>&lt;b&gt;dream&lt;/b&gt;</mark>"],
  ])(
    "highlight('%s', %j) should return '%s'",
    (text, tokens, matched, result) => {
      expect(highlight(text, tokens, matched)).toEqual(result);
    }
  );
});
