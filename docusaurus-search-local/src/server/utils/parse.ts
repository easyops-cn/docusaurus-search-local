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
  { ignoreCssSelectors, forceIgnoreNoIndex }: ProcessedPluginOptions
): ParsedDocument | null {
  const $ = cheerio.load(html);

  const robotsMeta = $('meta[name="robots"]');
  if (!forceIgnoreNoIndex && robotsMeta.attr("content")?.includes("noindex")) {
    // Unlisted content
    return null;
  }

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
