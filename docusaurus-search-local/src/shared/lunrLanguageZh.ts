import { generateTrimmer } from "./generateTrimmer";

// `lunr-languages/lunr.stemmer.support` is required.

export function lunrLanguageZh(lunr: any, tokenizer?: any): void {
  lunr.trimmerSupport.generateTrimmer = generateTrimmer;

  lunr.zh = function () {
    this.pipeline.reset();
    this.pipeline.add(lunr.zh.trimmer, lunr.zh.stopWordFilter);

    if (tokenizer) {
      this.tokenizer = tokenizer;
    }
  };

  if (tokenizer) {
    lunr.zh.tokenizer = tokenizer;
  }

  // https://zhuanlan.zhihu.com/p/33335629
  // https://mothereff.in/regexpu#input=const+regex+%3D+/%5Cp%7BUnified_Ideograph%7D/u%3B&unicodePropertyEscape=1
  lunr.zh.wordCharacters =
    "\\u3400-\\u4DBF\\u4E00-\\u9FFC\\uFA0E\\uFA0F\\uFA11\\uFA13\\uFA14\\uFA1F\\uFA21\\uFA23\\uFA24\\uFA27-\\uFA29\\u{20000}-\\u{2A6DD}\\u{2A700}-\\u{2B734}\\u{2B740}-\\u{2B81D}\\u{2B820}-\\u{2CEA1}\\u{2CEB0}-\\u{2EBE0}\\u{30000}-\\u{3134A}";
  lunr.zh.trimmer = lunr.trimmerSupport.generateTrimmer(lunr.zh.wordCharacters);
  lunr.Pipeline.registerFunction(lunr.zh.trimmer, "trimmer-zh");

  /* lunr stop word filter. see https://www.ranks.nl/stopwords/chinese-stopwords */
  lunr.zh.stopWordFilter = lunr.generateStopWordFilter(
    "的 一 不 在 人 有 是 为 以 于 上 他 而 后 之 来 及 了 因 下 可 到 由 这 与 也 此 但 并 个 其 已 无 小 我 们 起 最 再 今 去 好 只 又 或 很 亦 某 把 那 你 乃 它 吧 被 比 别 趁 当 从 到 得 打 凡 儿 尔 该 各 给 跟 和 何 还 即 几 既 看 据 距 靠 啦 了 另 么 每 们 嘛 拿 哪 那 您 凭 且 却 让 仍 啥 如 若 使 谁 虽 随 同 所 她 哇 嗡 往 哪 些 向 沿 哟 用 于 咱 则 怎 曾 至 致 着 诸 自".split(
      " "
    )
  );
  lunr.Pipeline.registerFunction(lunr.zh.stopWordFilter, "stopWordFilter-zh");
}
