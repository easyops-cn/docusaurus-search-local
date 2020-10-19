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
} from "./icons";

export function SuggestionTemplate({
  document,
  type,
  page,
  metadata,
  tokens,
  isInterOfTree,
  isLastOfTree,
}: Omit<SearchResult, "score" | "index">): string {
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
          // Todo(weareoutman): This is for EasyOps only.
          // istanbul ignore next
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
