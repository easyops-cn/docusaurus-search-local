/* eslint @typescript-eslint/no-var-requires: 0 */
import lunr from "lunr";
import {
  ProcessedPluginOptions,
  SearchDocument,
  WrappedIndex,
} from "../../shared/interfaces";

export function buildIndex(
  allDocuments: SearchDocument[][],
  {
    language,
    removeDefaultStopWordFilter,
    removeDefaultStemmer,
    zhUserDict,
    zhUserDictPath,
  }: ProcessedPluginOptions
): Omit<WrappedIndex, "type">[] {
  if (language.length > 1 || language.some((item) => item !== "en")) {
    require("lunr-languages/lunr.stemmer.support")(lunr);
  }
  if (language.includes("ja") || language.includes("jp")) {
    require("lunr-languages/tinyseg")(lunr);
  }
  for (const lang of language.filter(
    (item) => item !== "en" && item !== "zh"
  )) {
    require(`lunr-languages/lunr.${lang}`)(lunr);
  }
  if (language.includes("zh")) {
    const { tokenizer, loadUserDict } = require("./tokenizer");
    loadUserDict(zhUserDict, zhUserDictPath);
    require("../../shared/lunrLanguageZh").lunrLanguageZh(lunr, tokenizer);
  }
  if (language.length > 1) {
    require("lunr-languages/lunr.multi")(lunr);
  }

  return allDocuments.map((documents) => ({
    documents,
    index: lunr(function () {
      if (language.length > 1) {
        this.use((lunr as any).multiLanguage(...language));
      } else if (language[0] !== "en") {
        this.use((lunr as any)[language[0]]);
      }

      if (removeDefaultStopWordFilter) {
        // Sometimes we need no English stop words,
        // since they are almost all programming code.
        this.pipeline.remove(lunr.stopWordFilter);
      }

      if (removeDefaultStemmer) {
        this.pipeline.remove(lunr.stemmer);
      }

      // Override tokenizer when language `zh` is enabled.
      if (language.includes("zh")) {
        this.tokenizer = (lunr as any).zh.tokenizer;
      }

      this.ref("i");
      this.field("t");
      this.metadataWhitelist = ["position"];

      documents.forEach((doc) => {
        this.add({
          ...doc,
          // The ref must be a string.
          i: doc.i.toString(),
        });
      });
    }),
  }));
}
