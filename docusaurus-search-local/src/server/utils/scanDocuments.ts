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

function checkForIndexFile(dirPath: string): string | null {
  try {
      const stat = fs.statSync(dirPath);
      if (stat.isDirectory()) {
          const files = fs.readdirSync(dirPath);
          for (const file of files) {
              if (file.startsWith('index')) {
                  return path.join(dirPath, file);
              }
          }
      }
  } catch (err: any) {
      // Handle errors, such as directory not found
      if (err.code !== 'ENOENT') {
          console.error(`Error checking for index file: ${err.message}`);
      }
  }
  return null;
}

function resolveFilePath(filePath: string): string | null {
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const pathWithoutExtension = path.join(dir, baseName);

  try {
      const indexFilePath = checkForIndexFile(pathWithoutExtension);
      if (indexFilePath) {
          return indexFilePath;
      }
      const itemsInThePath = pathWithoutExtension.split(path.sep);
      // Recursively search for a matching file
      const baseName = itemsInThePath.shift();
      const resolvedPath = recursiveSearch(itemsInThePath, baseName ?? '');
      return resolvedPath ? resolvedPath : null;
  } catch (err: any) {
      // Handle errors, such as directory not found
      if (err.code === 'ENOENT') {
          console.error(`Error: Directory not found - ${dir}`);
      } else {
          console.error(`Error reading directory: ${err.message}`);
      }
      return null;
  }
}

function recursiveSearch(itemsInThePath: string[], pathStr: string): string | null {
  // this function takes an array of items in the path and recursively searches for a matching file
  // get the first item from itemsInThePath
  const baseName = itemsInThePath.shift();
  if (!baseName) {
      return null;
  }
  const files = fs.readdirSync(pathStr);

  // Regular expression to match files with an optional prefix followed by the base name
  const regex = new RegExp(`(^\\d+-)?${baseName}`);

  for (const file of files) {
      // ignore temp files and files started with '.'
      if (file.startsWith('.') || file.endsWith('~')) {
        continue;
      }
      const fullPath = path.join(pathStr, file);
      try {
        const stat = fs.statSync(fullPath);
        if (regex.test(file) && itemsInThePath.length > 0) {
            const result = recursiveSearch(itemsInThePath, fullPath);
            if (result) {
                return result;
            }
        } else if (regex.test(file) && itemsInThePath.length === 0) {
            // If the file is a directory, check for an index file
            const indexFilePath = checkForIndexFile(fullPath)
            return indexFilePath ? indexFilePath : fullPath;
        }
      } catch (err: any) {
          // Handle errors, such as directory not found
          if (err.code === 'ENOENT') {
              console.error(`Error: Directory not found [recursiveSearch] - ${fullPath}`);
          } else {
              console.error(`Error reading directory: ${err.message}`);
          }
      }
  }

  // If no match is found in this directory or its subdirectories
  return null;
}

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
  const unResolvedFiles: string[] = [];
  let successfullyParsedFilesCount: number = 0;
  await Promise.all(
    DocInfoWithFilePathList.map(async ({ filePath, url, type }) => {
      debugVerbose(
        `parsing %s file %o of %o`,
        type,
        path.relative(process.cwd(), filePath),
        url
      );
      let newfilePath = path.join('./docs', path.relative(process.cwd(), filePath).replace('build/', ''))
      const resolvedFilePath = resolveFilePath(newfilePath);
      if (!resolvedFilePath) {
        unResolvedFiles.push(newfilePath);
        return;
      }
      try {
        const html = await readFileAsync(resolvedFilePath, { encoding: "utf8" });
        const { data: frontmatter, content: markdownContent } = matter(html)
        const processedContent = await remark().use(remarkHtml).process(markdownContent);

        const htmlContent = processedContent.toString();

        const parsed = parse(htmlContent, type, url, config, frontmatter);
        if (!parsed) {
          // Unlisted content
          return;
        }
        successfullyParsedFilesCount += 1;
        const { pageTitle, description, keywords, sections, breadcrumb } = parsed;

        if (sections.length) {
          console.log(parsed)
        }

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
        errorFiles.push(resolvedFilePath);
        // console.error(`Failed to parse ${type} file ${filePath}`, e);
      }
    })
  );
  console.log('Total files', DocInfoWithFilePathList.length)
  console.log('Successfully parsed files', successfullyParsedFilesCount)
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
