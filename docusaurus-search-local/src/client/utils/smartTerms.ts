import { SmartTerm } from "../../shared/interfaces";
import { cutZhWords } from "./cutZhWords";

const MAX_TERMS = 12;
const HALF_MAX_TERMS = MAX_TERMS / 2;

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
  const tokenTerms = tokens
    .map((token) => {
      if (/\p{Unified_Ideograph}/u.test(token)) {
        return cutZhWords(token, zhDictionary);
      } else {
        return [{ value: token }];
      }
    })
    .slice(0, MAX_TERMS);

  const tokenTermsThatAreMultiple = tokenTerms.filter(
    (tokenTerm) => tokenTerm.length > 1
  );

  let termsProduct = 1;
  let overflowed = false;

  for (const tokenTerm of tokenTermsThatAreMultiple) {
    if (overflowed) {
      tokenTerm.splice(1, tokenTerm.length - 1);
    } else {
      if (tokenTerm.length > HALF_MAX_TERMS) {
        tokenTerm.splice(HALF_MAX_TERMS, tokenTerm.length - HALF_MAX_TERMS);
      }
      const product = termsProduct * tokenTerm.length;
      if (product >= MAX_TERMS) {
        if (product > MAX_TERMS) {
          const max = Math.floor(MAX_TERMS / termsProduct);
          tokenTerm.splice(max, tokenTerm.length - max);
          termsProduct = max * termsProduct;
        } else {
          termsProduct = product;
        }
        if (termsProduct > HALF_MAX_TERMS) {
          overflowed = true;
        }
      } else {
        termsProduct = product;
      }
    }
  }

  // Get all possible combinations of terms.
  const terms: SmartTerm[] = [];
  function combine(index: number, carry: SmartTerm): void {
    if (index === tokenTerms.length || carry.length >= MAX_TERMS) {
      terms.push(carry.slice(0, MAX_TERMS));
      return;
    }
    for (const term of tokenTerms[index]) {
      combine(index + 1, carry.concat(term));
    }
  }
  combine(0, []);

  return terms;
}
