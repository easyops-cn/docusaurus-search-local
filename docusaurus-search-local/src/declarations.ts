declare module "@easyops-cn/autocomplete.js" {
  export const noConflict: () => void;
}

declare module "*/generated.js" {
  export const language: string[];
  export const removeDefaultStopWordFilter: string[];
  export const removeDefaultStemmer: string[];
  export class Mark {
    constructor(root: HTMLElement);
    mark: (terms: string[], options?: Record<string, unknown>) => void;
    unmark: () => void;
  }
  export const searchIndexUrl: string;
  export const searchResultLimits: number;
  export const searchResultContextMaxLength: number;
  export const explicitSearchResultPath: boolean;
  export const searchBarShortcut: boolean;
  export const searchBarShortcutHint: boolean;
  export const searchBarPosition: "left" | "right";
  export const docsPluginIdForPreferredVersion: string;
  export const indexDocs: boolean;
  export const searchContextByPaths: (
    | string
    | { label: string | Record<string, string>; path: string }
  )[];
  export const hideSearchBarWithNoSearchContext: boolean;
  export const useAllContextsWithNoSearchContext: boolean;
  // These below are for mocking only.
  export const __setLanguage: (value: string[]) => void;
  export const __setRemoveDefaultStopWordFilter: (value: boolean) => void;
  export const __setRemoveDefaultStemmer: (value: boolean) => void;
}

declare module "@docusaurus/Head";
