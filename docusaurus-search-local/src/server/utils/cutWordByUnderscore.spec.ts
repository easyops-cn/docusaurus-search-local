import { cutWordByUnderscore } from "./cutWordByUnderscore";

describe("cutWordByUnderscore", () => {
  test.each<[string, string[]]>([
    ["api_gateway_v2", ["api", "_", "gateway", "_", "v2"]],
    ["one", ["one"]],
    ["_kind_", ["_", "kind", "_"]],
  ])(
    "cutWordByUnderscore('%s', zhDictionary) should return %j",
    (input, tokens) => {
      expect(cutWordByUnderscore(input)).toEqual(tokens);
    }
  );
});
