import fs from "fs";
import path from "path";
import { ProcessedPluginOptions } from "../../shared/interfaces";
import { getIndexHash } from "./getIndexHash";

export function generate(config: ProcessedPluginOptions, dir: string): void {
  const { language, searchResultLimits, searchResultContextMaxLength } = config;
  const indexHash = getIndexHash(config);
  const contents: string[] = [
    `import lunr from ${JSON.stringify(require.resolve("lunr"))};`,
  ];
  if (language.length > 1 || language.some((item) => item !== "en")) {
    contents.push(
      `require(${JSON.stringify(
        require.resolve("lunr-languages/lunr.stemmer.support")
      )})(lunr);`
    );
  }
  if (language.includes("ja") || language.includes("jp")) {
    contents.push(
      `require(${JSON.stringify(
        require.resolve("lunr-languages/tinyseg")
      )})(lunr);`
    );
  }
  for (const lang of language.filter(
    (item) => item !== "en" && item !== "zh"
  )) {
    contents.push(
      `require(${JSON.stringify(
        require.resolve(`lunr-languages/lunr.${lang}`)
      )})(lunr);`
    );
  }
  if (language.includes("zh")) {
    contents.push(
      'require("@easyops-cn/docusaurus-search-local/dist/client/shared/lunrLanguageZh").lunrLanguageZh(lunr);'
    );
  }
  if (language.length > 1) {
    contents.push(
      `require(${JSON.stringify(
        require.resolve("lunr-languages/lunr.multi")
      )})(lunr);`
    );
  }
  contents.push(`export const language = ${JSON.stringify(language)};`);
  contents.push(`export const indexHash = ${JSON.stringify(indexHash)};`);
  contents.push(
    `export const searchResultLimits = ${JSON.stringify(searchResultLimits)};`,
    `export const searchResultContextMaxLength = ${JSON.stringify(
      searchResultContextMaxLength
    )};`
  );

  fs.writeFileSync(path.join(dir, "generated.js"), contents.join("\n"));
}
