declare module "@easyops-cn/autocomplete.js" {
  export const noConflict: () => void;
}

declare module "*/generated.js" {
  export const removeDefaultStemmer: string[];
  export class Mark {
    constructor(root: HTMLElement);
    mark: (terms: string[], options?: Record<string, unknown>) => void;
    unmark: () => void;
  }
  export const searchResultContextMaxLength: number;
  export const explicitSearchResultPath: boolean;
  export const searchBarShortcut: boolean;
  export const searchBarShortcutHint: boolean;
  export const removeSeeAllResults: boolean;
  export const searchBarPosition: "left" | "right";
  export const docsPluginIdForPreferredVersion: string;
  export const indexDocs: boolean;
  export const searchContextByPaths: (
    | string
    | { label: string | Record<string, string>; path: string }
  )[];
  export const hideSearchBarWithNoSearchContext: boolean;
  export const useAllContextsWithNoSearchContext: boolean;
  export const forceIgnoreNoIndex: boolean;
}

declare module "*/generated-constants.js" {
  export const removeDefaultStopWordFilter: string[];
  export const language: string[];
  export const searchIndexUrl: string;
  export const searchResultLimits: number;
  // These below are for mocking only.
  export const __setLanguage: (value: string[]) => void;
  export const __setRemoveDefaultStopWordFilter: (value: boolean) => void;
}

declare module "@docusaurus/Head";
