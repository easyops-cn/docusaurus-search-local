import fs from "fs";
import { getIndexHash } from "./getIndexHash";
import { generate } from "./generate";
import { ProcessedPluginOptions } from "../../shared/interfaces";

jest.mock("./getIndexHash");

const mockWriteFileSync = jest
  .spyOn(fs, "writeFileSync")
  .mockImplementation(() => void 0);
(getIndexHash as jest.MockedFunction<typeof getIndexHash>).mockReturnValue(
  "abc"
);

describe("generate", () => {
  test.each<[string[], string[]]>([
    [["en"], ['import lunr from "lunr";', 'export const indexHash = "abc";']],
    [
      ["zh"],
      [
        'import lunr from "lunr";',
        'require("lunr-languages/lunr.stemmer.support")(lunr);',
        'require("./client/shared/lunrLanguageZh").lunrLanguageZh(lunr);',
        'export const indexHash = "abc";',
      ],
    ],
    [
      ["en", "zh"],
      [
        'import lunr from "lunr";',
        'require("lunr-languages/lunr.stemmer.support")(lunr);',
        'require("./client/shared/lunrLanguageZh").lunrLanguageZh(lunr);',
        'require("lunr-languages/lunr.multi")(lunr);',
        'export const indexHash = "abc";',
      ],
    ],
    [
      ["en", "es", "zh"],
      [
        'import lunr from "lunr";',
        'require("lunr-languages/lunr.stemmer.support")(lunr);',
        'require("lunr-languages/lunr.es")(lunr);',
        'require("./client/shared/lunrLanguageZh").lunrLanguageZh(lunr);',
        'require("lunr-languages/lunr.multi")(lunr);',
        'export const indexHash = "abc";',
      ],
    ],
  ])("", (language, contents) => {
    generate({ language } as ProcessedPluginOptions);
    expect(mockWriteFileSync).toBeCalledWith(
      expect.stringContaining("generated.js"),
      contents.join("\n")
    );
  });
});
