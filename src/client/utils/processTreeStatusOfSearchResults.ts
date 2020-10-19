import { InitialSearchResult } from "../../shared/interfaces";

export function processTreeStatusOfSearchResults(
  results: InitialSearchResult[]
): void {
  results.forEach((item, i) => {
    if (
      i > 0 &&
      item.page &&
      results.some((prev) => prev.document === item.page)
    ) {
      if (i < results.length - 1 && results[i + 1].page === item.page) {
        item.isInterOfTree = true;
      } else {
        item.isLastOfTree = true;
      }
    }
  });
}
