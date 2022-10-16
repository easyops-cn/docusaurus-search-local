import lunr from "lunr";
import {
  SearchDocument,
  SearchDocumentType,
  WrappedIndex,
} from "../../../shared/interfaces";
import { searchIndexUrl } from "../../utils/proxiedGenerated";

interface SerializedIndex {
  documents: SearchDocument[];
  index: {
    invertedIndex: [string][];
  };
}

export interface IndexesData {
  wrappedIndexes: WrappedIndex[];
  zhDictionary: string[];
}

const cache = new Map<string, Promise<IndexesData>>();

export function fetchIndexes(
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

export async function legacyFetchIndexes(
  baseUrl: string,
  searchContext: string
): Promise<IndexesData> {
  if (process.env.NODE_ENV === "production") {
    const json = (await (
      await fetch(
        `${baseUrl}${searchIndexUrl.replace(
          "{dir}",
          searchContext ? `-${searchContext.replace(/\//g, "-")}` : ""
        )}`
      )
    ).json()) as SerializedIndex[];

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

  // The index does not exist in development, therefore load a dummy index here.
  return {
    wrappedIndexes: [],
    zhDictionary: [],
  };
}
