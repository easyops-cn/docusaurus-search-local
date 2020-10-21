import lunr from "lunr";
import {
  ProcessedPluginOptions,
  SearchDocument,
  WrappedIndex,
} from "../../shared/interfaces";

export function buildIndex(
  allDocuments: SearchDocument[][],
  { language, removeDefaultStopWordFilter }: ProcessedPluginOptions
): Omit<WrappedIndex, "type">[] {
  if (language.length > 1 || language.some((item) => item !== "en")) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("lunr-languages/lunr.stemmer.support")(lunr);
  }
  for (const lang of language.filter(
    (item) => item !== "en" && item !== "zh"
  )) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(`lunr-languages/lunr.${lang}`)(lunr);
  }
  if (language.includes("zh")) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../../shared/lunrLanguageZh").lunrLanguageZh(
      lunr,
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("./tokenizer").tokenizer
    );
  }
  if (language.length > 1) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
