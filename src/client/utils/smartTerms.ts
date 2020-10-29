import { SmartTerm } from "../../shared/interfaces";
import { cutZhWords } from "./cutZhWords";

/**
 * Get all possible terms for a list of tokens consists of words mixed in Chinese and non-Chinese,
 * by a Chinese words dictionary.
 *
 * @param tokens - Tokens consists of English words or strings of consecutive Chinese words.
 * @param zhDictionary - A Chinese words dictionary.
 *
 * @returns A smart term list.
 */
export function smartTerms(
  tokens: string[],
  zhDictionary: string[]
): SmartTerm[] {
  const terms: SmartTerm[] = [];

  function cutMixedWords(subTokens: string[], carry: SmartTerm): void {
    if (subTokens.length === 0) {
      terms.push(carry);
      return;
    }
    const token = subTokens[0];
    if (/\p{Unified_Ideograph}/u.test(token)) {
      const terms = cutZhWords(token, zhDictionary);
      for (const term of terms) {
        const nextCarry = carry.concat(...term);
        cutMixedWords(subTokens.slice(1), nextCarry);
      }
    } else {
      const nextCarry = carry.concat(token);
      cutMixedWords(subTokens.slice(1), nextCarry);
    }
  }

  cutMixedWords(tokens, []);

  return terms;
}
