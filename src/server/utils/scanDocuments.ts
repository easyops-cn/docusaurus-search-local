import fs from "fs";
import util from "util";
import _debug from "debug";
import { DocInfo, SearchDocument } from "../../shared/interfaces";
import { parse } from "./parse";

const readFileAsync = util.promisify(fs.readFile);
const debug = _debug("search-local");

let nextDocId = 0;
const getNextDocId = () => {
  return (nextDocId += 1);
};

export async function scanDocuments(
  docInfoList: DocInfo[]
): Promise<SearchDocument[][]> {
  const titleDocuments: SearchDocument[] = [];
  const headingDocuments: SearchDocument[] = [];
  const contentDocuments: SearchDocument[] = [];
  const allDocuments = [titleDocuments, headingDocuments, contentDocuments];

  await Promise.all(
    docInfoList.map(async ({ filePath, url, type }) => {
      debug(`Parsing ${type} file ${filePath}`, { url });

      const html = await readFileAsync(filePath, { encoding: "utf8" });
      const { pageTitle, sections } = parse(html, type, url);

      const titleId = getNextDocId();

      titleDocuments.push({
        i: titleId,
        t: pageTitle,
        u: url,
      });

      for (const section of sections) {
        if (section.title !== pageTitle) {
          headingDocuments.push({
            i: getNextDocId(),
            t: section.title,
            u: url + section.hash,
            p: titleId,
          });
        }

        if (section.content) {
          contentDocuments.push({
            i: getNextDocId(),
            t: section.content,
            u: url + section.hash,
            p: titleId,
          });
        }
      }
    })
  );
  return allDocuments;
}
