// import { TranslationMap } from "./shared/interfaces";

declare module "@docusaurus/router" {
  export const useHistory: () => {
    push: (url: string) => void;
    replace: (args: any) => void;
  };
}

declare module "@easyops-cn/autocomplete.js" {
  export const noConflict: () => void;
}

declare module "*/generated.js" {
  export const language: string[];
  export const removeDefaultStopWordFilter: string[];
  export class Mark {
    constructor(root: HTMLElement);
    mark: (terms: string[], options?: Record<string, unknown>) => void;
    unmark: () => void;
  }
  export const indexHash: string | undefined;
  export const searchResultLimits: number;
  export const searchResultContextMaxLength: number;
  export const translations: Required<TranslationMap>;
  // These below are for mocking only.
  export const __setLanguage: (value: string[]) => void;
  export const __setRemoveDefaultStopWordFilter: (value: boolean) => void;
}

declare module "@docusaurus/Head";

declare interface TranslationMap {
  search_placeholder?: string;
  see_all_results?: string;
  no_results?: string;
  search_results_for?: string;
  search_the_documentation?: string;
  count_documents_found?: string;
  count_documents_found_plural?: string;
  no_documents_were_found?: string;
}
