import {
  SearchDocument,
  SearchDocumentType,
  SearchResult,
} from "../../../shared/interfaces";
import { concatDocumentPath } from "../../utils/concatDocumentPath";
import { getStemmedPositions } from "../../utils/getStemmedPositions";
import { highlight } from "../../utils/highlight";
import { highlightStemmed } from "../../utils/highlightStemmed";
import { explicitSearchResultPath } from "../../utils/proxiedGenerated";
import {
  iconAction,
  iconContent,
  iconHeading,
  iconTitle,
  iconTreeInter,
  iconTreeLast,
} from "./icons";
import styles from "./SearchBar.module.css";

export function SuggestionTemplate({
  document,
  type,
  page,
  metadata,
  tokens,
  isInterOfTree,
  isLastOfTree,
}: Omit<SearchResult, "score" | "index">): string {
  const isTitle = type === SearchDocumentType.Title;
  const isKeywords = type === SearchDocumentType.Keywords;
  const isTitleRelated = isTitle || isKeywords;
  const isHeading = type === SearchDocumentType.Heading;
  const tree: string[] = [];
  if (isInterOfTree) {
    tree.push(iconTreeInter);
  } else if (isLastOfTree) {
    tree.push(iconTreeLast);
  }
  const treeWrapper = tree.map(
    (item) => `<span class="${styles.hitTree}">${item}</span>`
  );
  const icon = `<span class="${styles.hitIcon}">${
    isTitleRelated ? iconTitle : isHeading ? iconHeading : iconContent
  }</span>`;
  const wrapped = [
    `<span class="${styles.hitTitle}">${
      isKeywords
        ? highlight(document.s!, tokens)
        : highlightStemmed(
            document.t,
            getStemmedPositions(metadata, "t"),
            tokens
          )
    }</span>`,
  ];

  const needsExplicitHitPath =
    !isInterOfTree && !isLastOfTree && explicitSearchResultPath;
  if (needsExplicitHitPath) {
    const pathItems = page
      ? page.b
          ?.concat(page.t)
          .concat(!document.s || document.s === page.t ? [] : document.s)
      : document.b;
    wrapped.push(
      `<span class="${styles.hitPath}">${concatDocumentPath(
        pathItems ?? []
      )}</span>`
    );
  } else if (!isTitleRelated) {
    wrapped.push(
      `<span class="${styles.hitPath}">${highlight(
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

  const action = `<span class="${styles.hitAction}">${iconAction}</span>`;
  return [
    ...treeWrapper,
    icon,
    `<span class="${styles.hitWrapper}">`,
    ...wrapped,
    "</span>",
    action,
  ].join("");
}
