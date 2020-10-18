import { ParsedDocument } from "../../shared/interfaces";
import { getCondensedText } from "./getCondensedText";
import _debug from "debug";

const debug = _debug("search-local");

export function parsePage($: cheerio.Root, url: string): ParsedDocument {
  $("a[aria-hidden=true]").remove();

  $("a[aria-hidden=true]").remove();
  let $pageTitle = $("h1").first();
  if ($pageTitle.length === 0) {
    $pageTitle = $("title");
  }

  const pageTitle = $pageTitle.text();

  const $main = $("main");
  if ($main.length === 0) {
    debug(
      "Page has no <main>, therefore no content was indexed for this page '%s'.",
      url
    );
  }

  return {
    pageTitle,
    sections: [
      {
        title: pageTitle,
        hash: "",
        content:
          $main.length > 0 ? getCondensedText($main.get(0), $).trim() : "",
      },
    ],
  };
}
