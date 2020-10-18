import fs from "fs";
import path from "path";
import crypto from "crypto";
import util from "util";
import lunr from "lunr";
import klawSync from "klaw-sync";
import _debug from "debug";

import { parse } from "./utils/parse";
import { tokenizer } from "./utils/tokenizer";
import { SearchDocument } from "../shared/interfaces";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("lunr-languages/lunr.stemmer.support")(lunr);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("../shared/lunr-language-zh").lunrLanguageZh(lunr, tokenizer);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("lunr-languages/lunr.multi")(lunr);

const debug = _debug("search-local");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const md5sum = crypto.createHash("md5");

const flatMap = (
  array: unknown[],
  mapper: (element: any) => any
): unknown[] => {
  return array.reduce<unknown[]>((acc, element) => {
    return acc.concat(mapper(element));
  }, []);
};

// FIXME: Duplicated in src/theme/SearchBar/util.js
function urlMatchesPrefix(url: string, prefix: string) {
  if (prefix.endsWith("/")) {
    throw new Error(`prefix must not end with a /. This is a bug.`);
  }
  return url === prefix || url.startsWith(`${prefix}/`);
}

module.exports = function DocusaurusSearchLocalPlugin(
  context: any,
  options: any
): any {
  let blogBasePath =
    options.blogRouteBasePath !== undefined
      ? options.blogRouteBasePath
      : "/blog";
  let docsBasePath =
    options.docsRouteBasePath !== undefined
      ? options.docsRouteBasePath
      : "/docs";
  const indexPages =
    options.indexPages !== undefined ? options.indexPages : false;
  const indexBlog = options.indexBlog !== undefined ? options.indexBlog : true;
  const indexDocs = options.indexDocs !== undefined ? options.indexDocs : true;
  let language = options.language !== undefined ? options.language : "en";

  if (Array.isArray(language) && language.length === 1) {
    language = language[0];
  }

  if (!blogBasePath.startsWith("/")) {
    throw new Error(
      `blogBasePath must start with /, received: '${blogBasePath}'.`
    );
  }
  if (!docsBasePath.startsWith("/")) {
    throw new Error(
      `docsBasePath must start with /, received: '${docsBasePath}'.`
    );
  }
  blogBasePath = blogBasePath.substr(1);
  docsBasePath = docsBasePath.substr(1);

  // console.log("context", context);

  const files = klawSync(path.join(context.siteDir, "docs"), {
    nodir: true,
  }).concat(klawSync(path.join(context.siteDir, "blog"), { nodir: true }));

  for (const item of files) {
    const filePath = item.path;
    if (filePath.endsWith(".md")) {
      md5sum.update(fs.readFileSync(filePath));
    }
  }
  const indexHash = md5sum.digest("hex").substring(0, 8);

  fs.writeFileSync(
    path.resolve(__dirname, "../../generated.js"),
    `export const indexHash = "${indexHash}";\n`
  );

  return {
    name: "@easyops-cn/docusaurus-search-local",
    getThemePath() {
      return path.resolve(__dirname, "../../client/client/theme");
    },
    async postBuild({
      routesPaths = [],
      outDir,
      baseUrl,
    }: {
      routesPaths: string[];
      outDir: string;
      baseUrl: string;
    }) {
      debug("Gathering documents");

      const data = flatMap(routesPaths, (url: string): any => {
        const route = url.substr(baseUrl.length);
        if (!url.startsWith(baseUrl)) {
          throw new Error(
            `The route must start with the baseUrl ${baseUrl}, but was ${route}. This is a bug, please report it.`
          );
        }
        if (route === "404.html") {
          // Do not index error page.
          return [];
        }
        if (indexBlog && urlMatchesPrefix(route, blogBasePath)) {
          if (
            route === blogBasePath ||
            urlMatchesPrefix(route, `${blogBasePath}/tags`)
          ) {
            // Do not index list of blog posts and tags filter pages
            return [];
          }
          return { route, url, type: "blog" };
        }
        if (indexDocs && urlMatchesPrefix(route, docsBasePath)) {
          return { route, url, type: "docs" };
        }
        if (indexPages) {
          return { route, url, type: "page" };
        }
        return [];
      }).map(({ route, url, type }: any) => {
        const file = path.join(outDir, route, "index.html");
        return {
          file,
          url,
          type,
        };
      });

      debug("Parsing documents");

      // Give every index entry a unique id so that the index does not need to store long URLs.
      let nextDocId = 0;
      const getNextDocId = () => {
        return (nextDocId += 1);
      };

      const titleDocuments: SearchDocument[] = [];
      const headingDocuments: SearchDocument[] = [];
      const contentDocuments: SearchDocument[] = [];
      const allDocuments = [titleDocuments, headingDocuments, contentDocuments];

      await Promise.all(
        data.map(async ({ file, url, type }) => {
          debug(`Parsing ${type} file ${file}`, { url });

          const html = await readFileAsync(file, { encoding: "utf8" });
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

            contentDocuments.push({
              i: getNextDocId(),
              t: section.content,
              u: url + section.hash,
              p: titleId,
            });
          }
        })
      );

      debug("Building index");

      const searchIndex = allDocuments.map((documents) => ({
        documents,
        index: lunr(function () {
          this.use((lunr as any).multiLanguage("en", "zh"));

          // We need no English stop words,
          // since they are almost all programming code.
          this.pipeline.remove(lunr.stopWordFilter);

          this.tokenizer = (lunr as any).zh.tokenizer;

          this.ref("i");
          this.field("t");
          this.metadataWhitelist = ["position"];

          documents.forEach((doc) => {
            this.add({
              ...doc,
              // The ref must be a string.
              i: doc.i.toString(),
            });
          });
        }),
      }));

      debug("Writing index to disk");

      await writeFileAsync(
        path.join(outDir, "search-index.json"),
        JSON.stringify(searchIndex),
        { encoding: "utf8" }
      );

      debug("Index written to disk, success!");
    },
  };
};
