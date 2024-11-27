import fs from "fs";
import path from "path";
import { ProcessedPluginOptions } from "../../shared/interfaces";
import { getIndexHash } from "./getIndexHash";

export function generate(config: ProcessedPluginOptions, dir: string): string {
  const {
    language,
    removeDefaultStopWordFilter,
    removeDefaultStemmer,
    highlightSearchTermsOnTargetPage,
    searchResultLimits,
    searchResultContextMaxLength,
    explicitSearchResultPath,
    searchBarShortcut,
    searchBarShortcutHint,
    searchBarPosition,
    docsPluginIdForPreferredVersion,
    indexDocs,
    searchContextByPaths,
    hideSearchBarWithNoSearchContext,
    useAllContextsWithNoSearchContext,
  } = config;
  const indexHash = getIndexHash(config);
  const contents: string[] = [];
  contents.push(
    `export const removeDefaultStemmer = ${JSON.stringify(
      removeDefaultStemmer
    )};`
  );
  if (highlightSearchTermsOnTargetPage) {
    contents.push(
      `export { default as Mark } from ${JSON.stringify(
        require.resolve("mark.js")
      )}`
    );
  } else {
    contents.push("export const Mark = null;");
  }

  let searchIndexFilename = "search-index{dir}.json";
  let searchIndexQuery = "";

  if (indexHash) {
    if (config.hashed === "filename") {
      searchIndexFilename = `search-index{dir}-${indexHash}.json`;
    } else {
      searchIndexQuery = `?_=${indexHash}`;
    }
  }
  contents.push(
    `export const searchResultContextMaxLength = ${JSON.stringify(
      searchResultContextMaxLength
    )};`
  );
  contents.push(
    `export const explicitSearchResultPath = ${JSON.stringify(
      explicitSearchResultPath
    )};`
  );
  contents.push(
    `export const searchBarShortcut = ${JSON.stringify(searchBarShortcut)};`
  );
  contents.push(
    `export const searchBarShortcutHint = ${JSON.stringify(
      searchBarShortcutHint
    )};`
  );
  contents.push(
    `export const searchBarPosition = ${JSON.stringify(searchBarPosition)};`
  );
  contents.push(
    `export const docsPluginIdForPreferredVersion = ${
      docsPluginIdForPreferredVersion === undefined
        ? "undefined"
        : JSON.stringify(docsPluginIdForPreferredVersion)
    };`
  );
  contents.push(`export const indexDocs = ${JSON.stringify(indexDocs)};`);
  contents.push(
    `export const searchContextByPaths = ${JSON.stringify(
      Array.isArray(searchContextByPaths) && searchContextByPaths.length > 0
        ? searchContextByPaths
        : null
    )};`
  );
  contents.push(
    `export const hideSearchBarWithNoSearchContext = ${JSON.stringify(
      !!hideSearchBarWithNoSearchContext
    )};`
  );
  contents.push(
    `export const useAllContextsWithNoSearchContext = ${JSON.stringify(
      !!useAllContextsWithNoSearchContext
    )};`
  );
  fs.writeFileSync(path.join(dir, "generated.js"), contents.join("\n"));

  const constantContents: string[] = [
    `import lunr from ${JSON.stringify(require.resolve("lunr"))};`,
  ];
  if (language.length > 1 || language.some((item) => item !== "en")) {
    constantContents.push(
      `require(${JSON.stringify(
        require.resolve("lunr-languages/lunr.stemmer.support")
      )})(lunr);`
    );
  }
  if (language.includes("ja") || language.includes("jp")) {
    constantContents.push(
      `require(${JSON.stringify(
        require.resolve("lunr-languages/tinyseg")
      )})(lunr);`
    );
  }
  for (const lang of language.filter(
    (item) => item !== "en" && item !== "zh"
  )) {
    constantContents.push(
      `require(${JSON.stringify(
        require.resolve(`lunr-languages/lunr.${lang}`)
      )})(lunr);`
    );
  }
  if (language.includes("zh")) {
    constantContents.push(
      `require(${JSON.stringify(
        require.resolve(
          "@easyops-cn/docusaurus-search-local/dist/client/shared/lunrLanguageZh"
        )
      )}).lunrLanguageZh(lunr);`
    );
  }
  if (language.length > 1) {
    constantContents.push(
      `require(${JSON.stringify(
        require.resolve("lunr-languages/lunr.multi")
      )})(lunr);`
    );
  }
  constantContents.push(
    `export const removeDefaultStopWordFilter = ${JSON.stringify(
      removeDefaultStopWordFilter
    )};`
  );
  constantContents.push(`export const language = ${JSON.stringify(language)};`);
  const searchIndexUrl = searchIndexFilename + searchIndexQuery;
  constantContents.push(
    `export const searchIndexUrl = ${JSON.stringify(searchIndexUrl)};`,
    `export const searchResultLimits = ${JSON.stringify(searchResultLimits)};`,
  );
  fs.writeFileSync(path.join(dir, "generated-constants.js"), constantContents.join("\n"));

  return searchIndexFilename;
}
