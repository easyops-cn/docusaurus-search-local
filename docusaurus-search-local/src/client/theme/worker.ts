import * as Comlink from "comlink";
import lunr from "lunr";
import { searchIndexUrl, language } from "../utils/proxiedGeneratedConstants";
import { tokenize } from "../utils/tokenize";
import { smartQueries } from "../utils/smartQueries";
import {
  MatchMetadata,
  WrappedIndex,
  SearchResult,
  SearchDocument,
  InitialSearchResult,
  SearchDocumentType,
} from "../../shared/interfaces";
import { sortSearchResults } from "../utils/sortSearchResults";
import { processTreeStatusOfSearchResults } from "../utils/processTreeStatusOfSearchResults";

interface SerializedIndex {
  documents: SearchDocument[];
  index: {
    invertedIndex: [string][];
  };
}

interface IndexesData {
  wrappedIndexes: WrappedIndex[];
  zhDictionary: string[];
}

const cache = new Map<string, Promise<IndexesData>>();

export class SearchWorker {
  async fetchIndexes(baseUrl: string, searchContext: string): Promise<void> {
    await this.lowLevelFetchIndexes(baseUrl, searchContext);
  }

  async lowLevelFetchIndexes(
    baseUrl: string,
    searchContext: string
  ): Promise<IndexesData> {
    const cacheKey = `${baseUrl}${searchContext}`;
    let promise = cache.get(cacheKey);
    if (!promise) {
      promise = legacyFetchIndexes(baseUrl, searchContext);
      cache.set(cacheKey, promise);
    }
    return promise;
  }

  async search(
    baseUrl: string,
    searchContext: string,
    input: string,
    limit: number
  ): Promise<SearchResult[]> {
    const rawTokens = tokenize(input, language);
    if (rawTokens.length === 0) {
      return [];
    }

    const { wrappedIndexes, zhDictionary } = await this.lowLevelFetchIndexes(
      baseUrl,
      searchContext
    );

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
            .slice(0, limit)
            // Remove duplicated results.
            .filter(
              (result) =>
                !results.some(
                  (item) => item.document.i.toString() === result.ref
                )
            )
            .slice(0, limit - results.length)
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
        if (results.length >= limit) {
          break search;
        }
      }
    }

    sortSearchResults(results);

    processTreeStatusOfSearchResults(results);

    return results as SearchResult[];
  }
}

async function legacyFetchIndexes(baseUrl: string, searchContext: string) {
  const url = `${baseUrl}${searchIndexUrl.replace(
    "{dir}",
    searchContext ? `-${searchContext.replace(/\//g, "-")}` : ""
  )}`;

  // Catch potential attacks.
  const fullUrl = new URL(url, location.origin);
  if (fullUrl.origin !== location.origin) {
    throw new Error("Unexpected version url");
  }

  const json = (await (await fetch(url)).json()) as SerializedIndex[];

  const wrappedIndexes: WrappedIndex[] = json.map(
    ({ documents, index }, type) => ({
      type: type as SearchDocumentType,
      documents,
      index: lunr.Index.load(index),
    })
  );

  const zhDictionary = json.reduce((acc, item) => {
    for (const tuple of item.index.invertedIndex) {
      if (/\p{Unified_Ideograph}/u.test(tuple[0][0])) {
        acc.add(tuple[0]);
      }
    }
    return acc;
  }, new Set<string>());

  return {
    wrappedIndexes,
    zhDictionary: Array.from(zhDictionary),
  };
}

Comlink.expose(SearchWorker);
