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

export async function fetchIndexes(baseUrl: string): Promise<{
  wrappedIndexes: WrappedIndex[];
  zhDictionary: string[];
}> {
  if (process.env.NODE_ENV === "production") {
    const json = (await (
      await fetch(`${baseUrl}${searchIndexUrl}`)
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
