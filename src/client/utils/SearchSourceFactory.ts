import { tokenize } from "./tokenize";
import { smartQueries } from "./smartQueries";
import {
  MatchMetadata,
  WrappedIndex,
  SearchResult,
  SearchDocument,
  InitialSearchResult,
} from "../../shared/interfaces";

export function SearchSourceFactory(
  wrappedIndexes: WrappedIndex[],
  zhDictionary: string[]
) {
  return function searchSource(
    input: string,
    cb: (results: SearchResult[]) => void
  ): void {
    const rawTokens = tokenize(input);
    if (rawTokens.length === 0) {
      cb([]);
      return;
    }

    const queries = smartQueries(rawTokens, zhDictionary);
    const results: InitialSearchResult[] = [];
    const resultsLimit = 8;

    search: for (const { keyword, tokens } of queries) {
      for (const { documents, index, type } of wrappedIndexes) {
        results.push(
          ...index
            .search(keyword)
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
                  type !== 0 &&
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

    results.forEach((item, index) => {
      item.index = index;
    });

    (results as SearchResult[]).sort((a, b) => {
      let c =
        a.type > 0 && a.page
          ? results.findIndex((item) => item.document === a.page)
          : a.index;
      let d =
        b.type > 0 && b.page
          ? results.findIndex((item) => item.document === b.page)
          : b.index;
      if (c === -1) {
        c = a.index;
      }
      if (d === -1) {
        d = b.index;
      }
      if (c === d) {
        if (a.type === 0) {
          return -1;
        }
        if (b.type === 0) {
          return 1;
        }
        return a.index - b.index;
      }
      return c - d;
    });

    results.forEach((item, index) => {
      if (
        index > 0 &&
        item.page &&
        results.some((prev) => prev.document === item.page)
      ) {
        if (
          index < results.length - 1 &&
          results[index + 1].page === item.page
        ) {
          item.isInterOfTree = true;
        } else {
          item.isLastOfTree = true;
        }
      }
    });

    cb(results as SearchResult[]);
  };
}
