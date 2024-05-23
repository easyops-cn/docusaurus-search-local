import {
  InitialSearchResult,
  SearchDocumentType,
  SearchResult,
} from "../../shared/interfaces";

export function sortSearchResults(results: InitialSearchResult[]): void {
  results.forEach((item, index) => {
    item.index = index;
  });

  // Put search results of headings/contents/descriptions just after
  // their belonged page's title, if existed.
  (results as SearchResult[]).sort((a, b) => {
    let aPageIndex =
      (a.type === SearchDocumentType.Heading ||
        a.type === SearchDocumentType.Content ||
        a.type === SearchDocumentType.Description) &&
      a.page
        ? results.findIndex((item) => item.document === a.page)
        : a.index;

    let bPageIndex =
      (b.type === SearchDocumentType.Heading ||
        b.type === SearchDocumentType.Content ||
        b.type === SearchDocumentType.Description) &&
      b.page
        ? results.findIndex((item) => item.document === b.page)
        : b.index;

    if (aPageIndex === -1) {
      aPageIndex = a.index;
    }

    if (bPageIndex === -1) {
      bPageIndex = b.index;
    }

    if (aPageIndex === bPageIndex) {
      const diff = (b.type === 0 ? 1 : 0) - (a.type === 0 ? 1 : 0);
      return diff === 0 ? a.index - b.index : diff;
    }

    return aPageIndex - bPageIndex;
  });
}
