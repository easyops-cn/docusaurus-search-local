import {
  InitialSearchResult,
  SearchDocumentType,
} from "../../shared/interfaces";

export function processTreeStatusOfSearchResults(
  results: InitialSearchResult[]
): void {
  results.forEach((item, i) => {
    if (
      i > 0 &&
      item.page &&
      results
        .slice(0, i)
        .some(
          (prev) =>
            (prev.type === SearchDocumentType.Keywords
              ? prev.page
              : prev.document) === item.page
        )
    ) {
      if (i < results.length - 1 && results[i + 1].page === item.page) {
        item.isInterOfTree = true;
      } else {
        item.isLastOfTree = true;
      }
    }
  });
}
