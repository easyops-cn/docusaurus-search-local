declare module "ai" {
  export interface UIMessage {}
  export interface UIMessageChunk {}
}

declare module "@easyops-cn/autocomplete.js" {
  export const noConflict: () => void;
}

// Type definition for open-ask-ai (optional dependency)
declare module "open-ask-ai" {
  export interface AskAIWidgetProps {
    [key: string]: any;
  }
  export interface AskAIWidgetRef {
    openWithNewSession: (query: string) => void;
  }
  export const AskAIWidget: any;
}

// Local interface for askAi config
interface AskAIConfig {
  [key: string]: any;
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
  export const searchBarShortcutKeymap: string;
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
  export const askAi: AskAIConfig | undefined;
}

declare module "*/generated-constants.js" {
  export const removeDefaultStopWordFilter: string[];
  export const language: string[];
  export const searchIndexUrl: string;
  export const searchResultLimits: number;
  export const fuzzyMatchingDistance: number;
  // These below are for mocking only.
  export const __setLanguage: (value: string[]) => void;
  export const __setRemoveDefaultStopWordFilter: (value: string[]) => void;
}

declare module "@docusaurus/Head";
