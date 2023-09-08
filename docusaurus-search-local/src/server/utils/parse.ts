import cheerio from "cheerio";
import {
  ParsedDocument,
  ProcessedPluginOptions,
} from "../../shared/interfaces";
import { parseDocument } from "./parseDocument";
import { parsePage } from "./parsePage";

export function parse(
  html: string,
  type: "docs" | "blog" | "page",
  url: string,
  { ignoreCssSelectors }: ProcessedPluginOptions
): ParsedDocument {
  const $ = cheerio.load(html);
  // Remove copy buttons from code boxes
  $('div[class^="mdxCodeBlock_"] button').remove();

  if (ignoreCssSelectors) {
    for (const ignoreSelector of ignoreCssSelectors) {
      $(ignoreSelector).remove();
    }
  }

  if (type === "docs") {
    // Remove version badges
    $("span.badge")
      .filter((_, element) => $(element).text().startsWith("Version:"))
      .remove();
  }

  if (type === "page") {
    return parsePage($, url);
  }

  return parseDocument($);
}
