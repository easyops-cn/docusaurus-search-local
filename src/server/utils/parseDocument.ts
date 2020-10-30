import { ParsedDocument, ParsedDocumentSection } from "../../shared/interfaces";
import { getCondensedText } from "./getCondensedText";

const HEADINGS = "h1, h2, h3";

export function parseDocument($: cheerio.Root): ParsedDocument {
  const $pageTitle = $("article header h1").first();
  const pageTitle = $pageTitle.text();

  const sections: ParsedDocumentSection[] = [];
  const breadcrumb: string[] = [];

  const navbarActiveItem = $(".navbar__link--active");
  if (navbarActiveItem.length > 0) {
    breadcrumb.push(navbarActiveItem.eq(0).text().trim());
  }

  const menu = $(".main-wrapper .menu");
  // console.log("menu.length", menu.length);
  if (menu.length > 0) {
    const activeMenuItem = menu
      .eq(0)
      .find(".menu__link--sublist.menu__link--active");
    // console.log("activeMenuItem.length", activeMenuItem.length);
    activeMenuItem.each((_, element) => {
      breadcrumb.push($(element).text().trim());
    });
  }

  $("article")
    .find(HEADINGS)
    .each((_, element) => {
      const $h = $(element);
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

  return { pageTitle, sections, breadcrumb };
}
