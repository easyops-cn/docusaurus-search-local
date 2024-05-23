import fs from "fs";
import path from "path";
import util from "util";
import {
  DocInfoWithFilePath,
  SearchDocument,
  ProcessedPluginOptions,
} from "../../shared/interfaces";
import { parse } from "./parse";
import { debugVerbose } from "./debug";

const readFileAsync = util.promisify(fs.readFile);

let nextDocId = 0;
const getNextDocId = () => {
  return (nextDocId += 1);
};

export async function scanDocuments(
  DocInfoWithFilePathList: DocInfoWithFilePath[],
  config: ProcessedPluginOptions
): Promise<SearchDocument[][]> {
  const titleDocuments: SearchDocument[] = [];
  const headingDocuments: SearchDocument[] = [];
  const descriptionDocuments: SearchDocument[] = [];
  const keywordsDocuments: SearchDocument[] = [];
  const contentDocuments: SearchDocument[] = [];
  const allDocuments = [
    titleDocuments,
    headingDocuments,
    descriptionDocuments,
    keywordsDocuments,
    contentDocuments,
  ];

  await Promise.all(
    DocInfoWithFilePathList.map(async ({ filePath, url, type }) => {
      debugVerbose(
        `parsing %s file %o of %o`,
        type,
        path.relative(process.cwd(), filePath),
        url
      );

      const html = await readFileAsync(filePath, { encoding: "utf8" });

      const parsed = parse(html, type, url, config);
      if (!parsed) {
        // Unlisted content
        return;
      }
      const { pageTitle, description, keywords, sections, breadcrumb } = parsed;

      const titleId = getNextDocId();

      titleDocuments.push({
        i: titleId,
        t: pageTitle,
        u: url,
        b: breadcrumb,
      });

      if (description) {
        descriptionDocuments.push({
          i: titleId,
          t: description,
          s: pageTitle,
          u: url,
          p: titleId,
        });
      }

      if (keywords) {
        keywordsDocuments.push({
          i: titleId,
          t: keywords,
          s: pageTitle,
          u: url,
          p: titleId,
        });
      }

      for (const section of sections) {
        if (section.title !== pageTitle) {
          headingDocuments.push({
            i: getNextDocId(),
            t: section.title,
            u: url,
            h: section.hash,
            p: titleId,
          });
        }

        if (section.content) {
          contentDocuments.push({
            i: getNextDocId(),
            t: section.content,
            s: section.title || pageTitle,
            u: url,
            h: section.hash,
            p: titleId,
          });
        }
      }
    })
  );
  return allDocuments;
}
