import _lunr from "lunr";
import { lunrLanguageZh as _lunrLanguageZh } from "./lunrLanguageZh";

describe("lunrLanguageZh", () => {
  let lunr: typeof _lunr;
  let lunrLanguageZh: typeof _lunrLanguageZh;

  beforeEach(() => {
    jest.resetModules();
    lunr = require("lunr");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("lunr-languages/lunr.stemmer.support")(lunr);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    lunrLanguageZh = require("./lunrLanguageZh").lunrLanguageZh;
  });

  test("should work with tokenizer", () => {
    const tokenizer = jest.fn();
    lunrLanguageZh(lunr, tokenizer);
    lunr(function () {
      this.use((lunr as any).zh);
      expect(this.tokenizer).toBe(tokenizer);
    });
    const token = new lunr.Token("生命科学", {});
    expect((lunr as any).zh.stemmer(token).toString()).toBe("生命科学");
  });

  test("should work with no tokenizer", () => {
    lunrLanguageZh(lunr);
    lunr(function () {
      const originalTokenizer = this.tokenizer;
      this.use((lunr as any).zh);
      expect(this.tokenizer).toBe(originalTokenizer);
    });
  });
});
