import { iconNoResults } from "./icons";

export function EmptyTemplate(): string {
  if (process.env.NODE_ENV === "production") {
    return `<span class="doc-search-empty"><span class="doc-search-empty-icon">${iconNoResults}</span><span class="doc-search-empty-text">No results.</span></span>`;
  }
  return `<span class="doc-search-empty">⚠️ The search index is only available when you run docusaurus build!</span>`;
}
