export let language = ["en", "zh"];
export let removeDefaultStopWordFilter = false;
export let removeDefaultStemmer = false;
export const indexHash = "abc";
export const searchResultLimits = 8;
export const searchResultContextMaxLength = 50;
export const explicitSearchResultPath = false;
export const translations = {
  search_placeholder: "Search",
  see_all_results: "See all results",
  no_results: "No results.",
  search_results_for: 'Search results for "{{ keyword }}"',
  search_the_documentation: "Search the documentation",
  count_documents_found: "{{ count }} document found",
  count_documents_found_plural: "{{ count }} documents found",
  no_documents_were_found: "No documents were found",
};

export function __setLanguage(value: string[]): void {
  language = value;
}

export function __setRemoveDefaultStopWordFilter(value: boolean): void {
  removeDefaultStopWordFilter = value;
}

export function __setRemoveDefaultStemmer(value: boolean): void {
  removeDefaultStemmer = value;
}
