import path from "path";
import {
  DocInfoWithFilePath,
  DocInfoWithRoute,
  ProcessedPluginOptions,
  PostBuildData,
} from "../../shared/interfaces";

export function processDocInfos(
  { routesPaths, outDir, baseUrl }: PostBuildData,
  {
    indexDocs,
    indexBlog,
    indexPages,
    docsBasePath,
    blogBasePath,
  }: ProcessedPluginOptions
): DocInfoWithFilePath[] {
  return routesPaths
    .map<DocInfoWithRoute | undefined>((url: string) => {
      const route = url.substr(baseUrl.length);
      if (!url.startsWith(baseUrl)) {
        throw new Error(
          `The route must start with the baseUrl ${baseUrl}, but was ${route}. This is a bug, please report it.`
        );
      }
      if (route === "404.html") {
        // Do not index error page.
        return;
      }
      if (indexBlog && urlMatchesPrefix(route, blogBasePath)) {
        if (
          route === blogBasePath ||
          urlMatchesPrefix(route, `${blogBasePath}/tags`)
        ) {
          // Do not index list of blog posts and tags filter pages
          return;
        }
        return { route, url, type: "blog" };
      }
      if (indexDocs && urlMatchesPrefix(route, docsBasePath)) {
        return { route, url, type: "docs" };
      }
      if (indexPages) {
        return { route, url, type: "page" };
      }
      return;
    })
    .filter<DocInfoWithRoute>(Boolean as any)
    .map(({ route, url, type }) => ({
      filePath: path.join(outDir, route, "index.html"),
      url,
      type,
    }));
}

function urlMatchesPrefix(url: string, prefix: string) {
  const rightTrimmedPrefix = prefix.replace(/\/$/, "");
  return url === rightTrimmedPrefix || url.startsWith(`${rightTrimmedPrefix}/`);
}
