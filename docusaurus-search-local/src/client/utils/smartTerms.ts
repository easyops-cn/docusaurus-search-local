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
  const tokenTerms = tokens.map((token) => {
    if (/\p{Unified_Ideograph}/u.test(token)) {
      return cutZhWords(token, zhDictionary);
    } else {
      return [{ value: token }];
    }
  });

  // Get all possible combinations of terms.
  const terms: SmartTerm[] = [];
  function combine(index: number, carry: SmartTerm): void {
    if (index === tokenTerms.length) {
      terms.push(carry);
      return;
    }
    for (const term of tokenTerms[index]) {
      combine(index + 1, carry.concat(term));
    }
  }
  combine(0, []);

  return terms;
}
