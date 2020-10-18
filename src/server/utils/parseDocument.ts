import { ParsedDocument, ParsedDocumentSection } from "../../shared/interfaces";
import { getCondensedText } from "./getCondensedText";

const HEADINGS = "h1, h2, h3";

export function parseDocument($: cheerio.Root): ParsedDocument {
  const $pageTitle = $("article header h1").first();
  const pageTitle = $pageTitle.text();

  const sections: ParsedDocumentSection[] = [];

  $("article")
    .find(HEADINGS)
    .each((_, heading) => {
      const $h = $(heading);
      // Remove elements that are marked as aria-hidden.
      // This is mainly done to remove anchors like this:
      // <a aria-hidden="true" tabindex="-1" class="hash-link" href="#first-subheader" title="Direct link to heading">#</a>
      const title = $h.contents().not("a[aria-hidden=true]").text().trim();
      const hash = $h.find("a.hash-link").attr("href") || "";

      let $sectionElements;
      if ($h.is($pageTitle)) {
        const $firstElement = $("article")
          .children() // div.markdown, header
          .not("header") // div.markdown
          .children() // h1, p, p, h2, ...
          .first(); // h1 || p
        if ($firstElement.filter(HEADINGS).length > 0) {
          return;
        }
        $sectionElements = $firstElement.nextUntil(HEADINGS).addBack();
      } else {
        $sectionElements = $h.nextUntil(HEADINGS);
      }
      const content = getCondensedText($sectionElements.get(), $);

      sections.push({
        title,
        hash,
        content,
      });
    });

  return { pageTitle, sections };
}
