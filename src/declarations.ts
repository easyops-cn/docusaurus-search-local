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
  export const indexHash: string | undefined;
  export const searchResultLimits: number;
  export const searchResultContextMaxLength: number;
  // These below are for mocking only.
  export const __setLanguage: (value: string[]) => void;
  export const __setRemoveDefaultStopWordFilter: (value: boolean) => void;
}

declare module "@docusaurus/Head";
