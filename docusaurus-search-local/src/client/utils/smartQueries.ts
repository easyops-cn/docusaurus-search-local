import lunr from "lunr";
import { SmartQuery, SmartTerm } from "../../shared/interfaces";
import { smartTerms } from "./smartTerms";
import {
  language,
  removeDefaultStopWordFilter,
  removeDefaultStemmer,
  fuzzyMatchingDistance,
  synonyms,
} from "./proxiedGeneratedConstants";
import { createSynonymsMap, expandTokens } from "../../shared/synonymsUtils";

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
  // Expand tokens with synonyms if configured
  let expandedTokens = tokens;
  if (synonyms && synonyms.length > 0) {
    // Get the stemmer function if stemming is not disabled
    const stemmerFn = !removeDefaultStemmer ? 
      (word: string) => (lunr as any).stemmer(word) : undefined;
    
    const synonymsMap = createSynonymsMap(synonyms, stemmerFn);
    expandedTokens = expandTokens(tokens, synonymsMap, stemmerFn);
  }

  const terms = smartTerms(expandedTokens, zhDictionary);

  if (terms.length === 0) {
    // There are no matched terms.
    // All tokens are considered required and with wildcard.
    return [
      {
        tokens: expandedTokens,
        term: expandedTokens.map((value) => ({
          value,
          presence: lunr.Query.presence.REQUIRED,
          wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
        })),
      },
    ];
  }

  // The last token of a term maybe incomplete while user is typing.
  for (const term of terms) {
    term[term.length - 1].maybeTyping = true;
  }

  // Try to append terms without stop words,
  // since they are removed in the index.
  const stopWordPipelines: lunr.PipelineFunction[] = [];
  for (const lang of language) {
    if (lang === "en") {
      if (!removeDefaultStopWordFilter.includes(lang)) {
        stopWordPipelines.unshift(lunr.stopWordFilter);
      }
    } else {
      const lunrLang = (lunr as any)[lang] as typeof lunr;
      if (
        lunrLang.stopWordFilter &&
        !removeDefaultStopWordFilter.includes(lang)
      ) {
        stopWordPipelines.unshift(lunrLang.stopWordFilter);
      }
    }
  }

  let refinedTerms: SmartTerm[];

  if (stopWordPipelines.length > 0) {
    const pipe = (term: SmartTerm) =>
      stopWordPipelines.reduce(
        (term, p) =>
          term.filter((item) =>
            (p as unknown as (str: string) => string | undefined)(item.value)
          ),
        term
      );
    refinedTerms = [];
    const newTerms: SmartTerm[] = [];
    for (const term of terms) {
      const filteredTerm = pipe(term);
      refinedTerms.push(filteredTerm);
      // Add extra terms only if some stop words are removed,
      // and some non-stop-words exist too.
      if (filteredTerm.length < term.length && filteredTerm.length > 0) {
        newTerms.push(filteredTerm);
      }
    }
    terms.push(...newTerms);
  } else {
    refinedTerms = terms.slice();
  }

  // Also try to add extra terms which miss one of the searched tokens,
  // when the term contains 3 or more tokens,
  // to improve the search precision.
  const extraTerms: SmartTerm[] = [];
  for (const term of refinedTerms) {
    if (term.length > 2) {
      for (let i = term.length - 1; i >= 0; i -= 1) {
        extraTerms.push(term.slice(0, i).concat(term.slice(i + 1)));
      }
    }
  }

  const distance = Math.max(0, fuzzyMatchingDistance);
  return getDistanceMatrix(terms, distance).concat(
    getDistanceMatrix(extraTerms, distance)
  );
}

function getQueriesMaybeTyping(
  terms: SmartTerm[],
  editDistance: number
): SmartQuery[] {
  return termsToQueries(terms, editDistance).concat(
    termsToQueries(
      // Ignore terms whose last token already has a trailing wildcard,
      // or the last token is not `maybeTyping`.
      terms.filter((term) => {
        const token = term[term.length - 1];
        return !token.trailing && token.maybeTyping;
      }),
      editDistance,
      true
    )
  );
}

function termsToQueries(
  terms: SmartTerm[],
  editDistance: number,
  maybeTyping?: boolean
): SmartQuery[] {
  return terms.flatMap((term) => {
    const query = {
      tokens: term.map((item) => item.value),
      term: term.map((item) => {
        // The last token of a term maybe incomplete while user is typing.
        // So append more queries with trailing wildcard added.
        const trailing = maybeTyping
          ? item.trailing || item.maybeTyping
          : item.trailing;
        const distance =
          editDistance > 0 && item.value.length > editDistance
            ? editDistance
            : undefined;
        return {
          value: item.value,
          presence: lunr.Query.presence.REQUIRED,
          wildcard: trailing
            ? lunr.Query.wildcard.TRAILING
            : lunr.Query.wildcard.NONE,
          editDistance: distance,
        };
      }),
    };

    // Ignore queries that all terms ignored edit distance due to too short tokens.
    if (editDistance && query.term.every((item) => !item.editDistance)) {
      return [];
    }

    return query;
  });
}

function getDistanceMatrix(terms: SmartTerm[], distance: number) {
  return Array.from({ length: distance + 1 }, (_, i) =>
    getQueriesMaybeTyping(terms, i)
  ).flat();
}
