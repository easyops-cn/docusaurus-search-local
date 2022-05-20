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
  export const indexHash: string | undefined;
  export const searchResultLimits: number;
  export const searchResultContextMaxLength: number;
  export const explicitSearchResultPath: boolean;
  // These below are for mocking only.
  export const __setLanguage: (value: string[]) => void;
  export const __setRemoveDefaultStopWordFilter: (value: boolean) => void;
  export const __setRemoveDefaultStemmer: (value: boolean) => void;
}

declare module "@docusaurus/Head";
