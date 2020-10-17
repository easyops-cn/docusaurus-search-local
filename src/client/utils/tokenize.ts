/**
 * Split a sentence to tokens, considering a sequence of consecutive Chinese words as a single token.
 *
 * @param text - Text to be tokenized.
 *
 * @returns Tokens.
 */
export function tokenize(text: string): string[] {
  return (
    text.toLowerCase().match(
      // https://zhuanlan.zhihu.com/p/33335629
      /\w+|\p{Unified_Ideograph}+/gu
      // https://mothereff.in/regexpu#input=const+regex+%3D+/%5Cp%7BUnified_Ideograph%7D/u%3B&unicodePropertyEscape=1
      // /\w+|[\u3400-\u4DBF\u4E00-\u9FFC\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29\u{20000}-\u{2A6DD}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{30000}-\u{3134A}]+/gu
    ) || []
  );
}
