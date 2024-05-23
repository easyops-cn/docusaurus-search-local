import { tokenize } from "./tokenize";
import { smartQueries } from "./smartQueries";
import {
  MatchMetadata,
  WrappedIndex,
  SearchResult,
  SearchDocument,
  InitialSearchResult,
  SearchDocumentType,
} from "../../shared/interfaces";
import { sortSearchResults } from "./sortSearchResults";
import { processTreeStatusOfSearchResults } from "./processTreeStatusOfSearchResults";
import { language } from "./proxiedGenerated";

export function SearchSourceFactory(
  wrappedIndexes: WrappedIndex[],
  zhDictionary: string[],
  resultsLimit: number
) {
  return function searchSource(
    input: string,
    callback: (results: SearchResult[]) => void
  ): void {
    const rawTokens = tokenize(input, language);
    if (rawTokens.length === 0) {
      callback([]);
      return;
    }

    const queries = smartQueries(rawTokens, zhDictionary);
    const results: InitialSearchResult[] = [];

    search: for (const { term, tokens } of queries) {
      for (const { documents, index, type } of wrappedIndexes) {
        results.push(
          ...index
            .query((query) => {
              for (const item of term) {
                query.term(item.value, {
                  wildcard: item.wildcard,
                  presence: item.presence,
                });
              }
            })
            .slice(0, resultsLimit)
            // Remove duplicated results.
            .filter(
              (result) =>
                !results.some(
                  (item) => item.document.i.toString() === result.ref
                )
            )
            .slice(0, resultsLimit - results.length)
            .map((result) => {
              const document = documents.find(
                (doc) => doc.i.toString() === result.ref
              ) as SearchDocument;
              return {
                document,
                type,
                page:
                  type !== SearchDocumentType.Title &&
                  wrappedIndexes[0].documents.find(
                    (doc) => doc.i === document.p
                  ),
                metadata: result.matchData.metadata as MatchMetadata,
                tokens,
                score: result.score,
              };
            })
        );
        if (results.length >= resultsLimit) {
          break search;
        }
      }
    }

    sortSearchResults(results);

    processTreeStatusOfSearchResults(results);

    callback(results as SearchResult[]);
  };
}
