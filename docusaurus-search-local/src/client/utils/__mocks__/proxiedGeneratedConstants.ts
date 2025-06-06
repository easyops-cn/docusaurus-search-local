export let language = ["en", "zh"];
export let removeDefaultStopWordFilter: string[] = [];
export const searchIndexUrl = "search-index{dir}.json?_=abc";
export const searchResultLimits = 8;
export let fuzzyMatchingDistance = 0;

export function __setLanguage(value: string[]): void {
  language = value;
}

export function __setRemoveDefaultStopWordFilter(value: string[]): void {
  removeDefaultStopWordFilter = value;
}

export function __setFuzzyMatchingDistance(value: number): void {
  fuzzyMatchingDistance = value;
}
