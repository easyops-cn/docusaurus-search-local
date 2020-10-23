import fs from "fs";
import path from "path";
import { ProcessedPluginOptions } from "../../shared/interfaces";
import { getIndexHash } from "./getIndexHash";

export function generate(config: ProcessedPluginOptions): void {
  const { language, searchResultLimits, searchResultContextMaxLength } = config;
  const indexHash = getIndexHash(config);
  const contents: string[] = ['import lunr from "lunr";'];
  if (language.length > 1 || language.some((item) => item !== "en")) {
    contents.push('require("lunr-languages/lunr.stemmer.support")(lunr);');
  }
  for (const lang of language.filter(
    (item) => item !== "en" && item !== "zh"
  )) {
    contents.push(`require("lunr-languages/lunr.${lang}")(lunr);`);
  }
  if (language.includes("zh")) {
    contents.push(
      'require("./client/shared/lunrLanguageZh").lunrLanguageZh(lunr);'
    );
  }
  if (language.length > 1) {
    contents.push('require("lunr-languages/lunr.multi")(lunr);');
  }
  contents.push(`export const indexHash = ${JSON.stringify(indexHash)};`);
  contents.push(
    `export const searchResultLimits = ${JSON.stringify(searchResultLimits)};`,
    `export const searchResultContextMaxLength = ${JSON.stringify(
      searchResultContextMaxLength
    )};`
  );

  fs.writeFileSync(
    path.resolve(__dirname, "../../../generated.js"),
    contents.join("\n")
  );
}
