import lunr from "lunr";
import { generateTrimmer } from "./generateTrimmer";

describe("generateTrimmer", () => {
  test("should work", () => {
    const trimmer = generateTrimmer("\\w");
    const token = new lunr.Token("..api..gateway..", {});
    trimmer(token);
    expect(token.toString()).toBe("api..gateway");
  });
});
