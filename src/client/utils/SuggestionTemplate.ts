import { SearchDocument, SearchResult } from "../../shared/interfaces";
import { highlight } from "./highlight";
import { highlightStemmed } from "./highlightStemmed";
import { getStemmedPositions } from "./getStemmedPositions";
import {
  iconTitle,
  iconHeading,
  iconContent,
  iconAction,
  iconTreeInter,
  iconTreeLast,
  iconNoResults,
} from "./icons";

export function SuggestionTemplate({
  document,
  type,
  page,
  metadata,
  tokens,
  isInterOfTree,
  isLastOfTree,
}: SearchResult): string {
  const fieldSet = new Set();
  for (const match of Object.values(metadata)) {
    for (const field of Object.keys(match)) {
      fieldSet.add(field);
    }
  }
  const isTitle = type === 0;
  const isHeading = type === 1;
  const tree: string[] = [];
  if (isInterOfTree) {
    tree.push(iconTreeInter);
  } else if (isLastOfTree) {
    tree.push(iconTreeLast);
  }
  const icon = `<span class="doc-search-hit-icon">${
    isTitle ? iconTitle : isHeading ? iconHeading : iconContent
  }</span>`;
  const wrapped = [
    `<span class="doc-search-hit-title">${highlightStemmed(
      document.t,
      getStemmedPositions(metadata, "t"),
      tokens
    )}</span>`,
  ];
  if (!isTitle) {
    wrapped.push(
      `<span class="doc-search-hit-path">${highlight(
        (page as SearchDocument).t ||
          (document.u.startsWith("/docs/api-reference/")
            ? "API Reference"
            : ""),
        tokens
      )}</span>`
    );
  }
  const action = `<span class="doc-search-hit-action">${iconAction}</span>`;
  return [
    ...tree,
    icon,
    '<span class="doc-search-hit-wrapper">',
    ...wrapped,
    "</span>",
    action,
  ].join("");
}

export function EmptyTemplate(): string {
  if (process.env.NODE_ENV === "production") {
    return `<span class="doc-search-empty"><span class="doc-search-empty-icon">${iconNoResults}</span><span class="doc-search-empty-text">No results.</span></span>`;
  } else {
    return `<span class="doc-search-empty">⚠️ The search index is only available when you run docusaurus build!</span>`;
  }
}
