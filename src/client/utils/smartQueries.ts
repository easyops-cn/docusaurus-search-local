import { SmartQuery } from "../../shared/interfaces";
import { smartTerms } from "./smartTerms";

/**
 * Get all possible queries for a list of tokens consists of words mixed English and Chinese,
 * by a Chinese words dictionary.
 *
 * @param tokens - Tokens consists of English words or strings of consecutive Chinese words.
 * @param zhDictionary - A Chinese words dictionary.
 *
 * @returns A smart query list.
 */
export function smartQueries(
  tokens: string[],
  zhDictionary: string[]
): SmartQuery[] {
  const terms = smartTerms(tokens, zhDictionary);

  if (terms.length === 0) {
    // There are no matched terms.
    // All tokens are considered required and with wildcard.
    return [
      {
        tokens,
        keyword: tokens.map((t) => `+*${t}*`).join(" "),
      },
    ];
  }

  return terms
    .map((term) => ({
      tokens: term.map((word) => word.replace(/\*$/, "")),
      keyword: term.map((word) => `+${word}`).join(" "),
    }))
    .concat(
      // The last token of a term maybe incomplete while user is typing.
      // So append more queries with trailing wildcard added.
      terms
        // Ignore terms whose last token already has a trailing wildcard.
        .filter((term) => !term[term.length - 1].endsWith("*"))
        .map((term) => ({
          tokens: term.map((word) => word.replace(/\*$/, "")),
          keyword: term
            .map(
              (word, index) => `+${word}${index === term.length - 1 ? "*" : ""}`
            )
            .join(" "),
        }))
    );
}
