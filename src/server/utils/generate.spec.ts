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
  test.each<[string[], any[]]>([
    [
      ["en"],
      [
        expect.stringMatching(/^import lunr from ".+\/lunr\/lunr\.js";$/),
        'export const indexHash = "abc";',
        "export const searchResultLimits = 8;",
        "export const searchResultContextMaxLength = 50;",
      ],
    ],
    [
      ["zh"],
      [
        expect.stringMatching(/^import lunr from ".+\/lunr\/lunr\.js";$/),
        expect.stringMatching(
          /^require\(".+\/lunr-languages\/lunr\.stemmer\.support\.js"\)\(lunr\);$/
        ),
        'require("@easyops-cn/docusaurus-search-local/dist/client/shared/lunrLanguageZh").lunrLanguageZh(lunr);',
        'export const indexHash = "abc";',
        "export const searchResultLimits = 8;",
        "export const searchResultContextMaxLength = 50;",
      ],
    ],
    [
      ["es"],
      [
        expect.stringMatching(/^import lunr from ".+\/lunr\/lunr\.js";$/),
        expect.stringMatching(
          /^require\(".+\/lunr-languages\/lunr\.stemmer\.support\.js"\)\(lunr\);$/
        ),
        expect.stringMatching(
          /^require\(".+\/lunr-languages\/lunr\.es\.js"\)\(lunr\);$/
        ),
        'export const indexHash = "abc";',
        "export const searchResultLimits = 8;",
        "export const searchResultContextMaxLength = 50;",
      ],
    ],
    [
      ["en", "zh"],
      [
        expect.stringMatching(/^import lunr from ".+\/lunr\/lunr\.js";$/),
        expect.stringMatching(
          /^require\(".+\/lunr-languages\/lunr\.stemmer\.support\.js"\)\(lunr\);$/
        ),
        'require("@easyops-cn/docusaurus-search-local/dist/client/shared/lunrLanguageZh").lunrLanguageZh(lunr);',
        expect.stringMatching(
          /^require\(".+\/lunr-languages\/lunr\.multi\.js"\)\(lunr\);$/
        ),
        'export const indexHash = "abc";',
        "export const searchResultLimits = 8;",
        "export const searchResultContextMaxLength = 50;",
      ],
    ],
    [
      ["en", "es", "zh"],
      [
        expect.stringMatching(/^import lunr from ".+\/lunr\/lunr\.js";$/),
        expect.stringMatching(
          /^require\(".+\/lunr-languages\/lunr\.stemmer\.support\.js"\)\(lunr\);$/
        ),
        expect.stringMatching(
          /^require\(".+\/lunr-languages\/lunr\.es\.js"\)\(lunr\);$/
        ),
        'require("@easyops-cn/docusaurus-search-local/dist/client/shared/lunrLanguageZh").lunrLanguageZh(lunr);',
        expect.stringMatching(
          /^require\(".+\/lunr-languages\/lunr\.multi\.js"\)\(lunr\);$/
        ),
        'export const indexHash = "abc";',
        "export const searchResultLimits = 8;",
        "export const searchResultContextMaxLength = 50;",
      ],
    ],
  ])("generate({ language: %j }, dir) should work", (language, contents) => {
    generate(
      {
        language,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      } as ProcessedPluginOptions,
      "/tmp"
    );
    expect(mockWriteFileSync).toBeCalledWith(
      "/tmp/generated.js",
      expect.any(String)
    );
    const calledContents = (mockWriteFileSync.mock.calls[0][1] as string).split(
      "\n"
    );
    expect(calledContents).toEqual(contents);
  });
});
