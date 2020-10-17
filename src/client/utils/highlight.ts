import { escapeHtml } from "./escapeHtml";

/**
 * Highlight specified tokens in text content.
 *
 * @param content - Text content.
 * @param tokens - Tokens to be highlighted (in lower-case and sorted by descending of length).
 * @param forceMatched - Whether to force matched.
 *
 * @returns A html string with marked tokens.
 */
export function highlight(
  content: string,
  tokens: string[],
  forceMatched?: boolean
): string {
  const html: string[] = [];

  for (const token of tokens) {
    const index = content.toLowerCase().indexOf(token);
    if (index >= 0) {
      if (index > 0) {
        html.push(highlight(content.substr(0, index), tokens));
      }
      html.push(
        `<mark>${escapeHtml(content.substr(index, token.length))}</mark>`
      );
      const end = index + token.length;
      if (end < content.length) {
        html.push(highlight(content.substr(end), tokens));
      }
      break;
    }
  }

  if (html.length === 0) {
    return forceMatched
      ? `<mark>${escapeHtml(content)}</mark>`
      : escapeHtml(content);
  }

  return html.join("");
}
