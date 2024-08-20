import fs from "fs";
import path from "path";
import util from "util";
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import * as cheerio from 'cheerio';
import matter from 'gray-matter';

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
  const errorFiles: string[] = [];
  await Promise.all(
    DocInfoWithFilePathList.map(async ({ filePath, url, type }) => {
      debugVerbose(
        `parsing %s file %o of %o`,
        type,
        path.relative(process.cwd(), filePath),
        url
      );
      let newfilePath = path.join('./docs', path.relative(process.cwd(), filePath).replace('build/', ''))
      // remove index.html from the end of the url
      if (newfilePath.endsWith(".html")) {
        if (newfilePath.endsWith("index.html")) {
          newfilePath = newfilePath.slice(0, -11);
        } else {
          newfilePath = newfilePath.slice(0, -5);
        }
        newfilePath = newfilePath + ".md";
      }
      if (!fs.existsSync(newfilePath)) {
        newfilePath = newfilePath + "x";
      }
      if (!fs.existsSync(newfilePath)) {
        newfilePath = newfilePath.replace('.mdx', '/index.md');
      }
      try {
        const html = await readFileAsync(newfilePath, { encoding: "utf8" });
        const { data: frontmatter, content: markdownContent } = matter(html)
        const processedContent = await remark().use(remarkHtml).process(markdownContent);

        const htmlContent = processedContent.toString();

        const parsed = parse(htmlContent, type, url, config, frontmatter);
        console.log('parsed', parsed)
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
          const trimmedHash = getTrimmedHash(section.hash, url);

          if (section.title !== pageTitle) {
            if (trimmedHash === false) {
              continue;
            }

            headingDocuments.push({
              i: getNextDocId(),
              t: section.title,
              u: url,
              h: trimmedHash,
              p: titleId,
            });
          }

          if (section.content) {
            if (trimmedHash === false) {
              continue;
            }

            contentDocuments.push({
              i: getNextDocId(),
              t: section.content,
              s: section.title || pageTitle,
              u: url,
              h: trimmedHash,
              p: titleId,
            });
          }
        }
      } catch (e) {
        errorFiles.push(newfilePath);
        // console.error(`Failed to parse ${type} file ${filePath}`, e);
      }
    })
  );
  console.log('errorFiles', errorFiles.length, errorFiles)
  return allDocuments;
}

function getTrimmedHash(hash: string, url: string) {
  if (hash && !hash.startsWith("#") && hash.includes("#")) {
    // The hash link may contains URL path, we need to remove it.
    if (hash.startsWith(url) && hash[url.length] === "#") {
      return hash.slice(url.length);
    }

    // If the hash doesn't start with the URL, it's likely an external link.
    // Don't know this will happen or not, but just in case.
    return false;
  }

  return hash;
}
