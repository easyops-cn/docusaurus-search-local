declare module "@docusaurus/useDocusaurusContext" {
  const useDocusaurusContext: () => {
    siteConfig: {
      baseUrl: string;
    };
  };
  export default useDocusaurusContext;
}

declare module "@docusaurus/router" {
  export const useHistory: () => {
    push: (url: string) => void;
  };
}

declare module "autocomplete.js" {
  export const noConflict: () => void;
}

declare module "*/generated.js" {
  export const indexHash: string;
}
