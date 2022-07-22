// We prepend and append whitespace for these tags.
// https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
const BLOCK_TAGS = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "details",
  "dialog",
  "dd",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "ul",
  // Not block tags, but still.
  "td",
  "th",
]);

export function getCondensedText(
  element: cheerio.Element | cheerio.Element[],
  $: cheerio.Root
): string {
  const getText = (element: cheerio.Element | cheerio.Element[]): string => {
    if (Array.isArray(element)) {
      return element.map((item) => getText(item)).join("");
    }
    if (element.type === "text") {
      return element.data as string;
    }
    if (element.type === "tag") {
      if (element.name === "br") {
        return " ";
      }
      const content = getText($(element).contents().get());
      if (BLOCK_TAGS.has(element.name)) {
        return " " + content + " ";
      }
      return content;
    }
    return "";
  };
  return getText(element).trim().replace(/\s+/g, " ");
}
