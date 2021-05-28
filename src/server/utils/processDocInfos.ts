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
    docsRouteBasePath,
    blogRouteBasePath,
    ignoreFiles,
  }: ProcessedPluginOptions
): DocInfoWithFilePath[] {
  return routesPaths
    .map<DocInfoWithRoute | undefined>((url: string) => {
      // istanbul ignore next
      if (!url.startsWith(baseUrl)) {
        throw new Error(
          `The route must start with the baseUrl "${baseUrl}", but was "${url}". This is a bug, please report it.`
        );
      }
      const route = url.substr(baseUrl.length);

      // ignore files
      if (
        ignoreFiles?.some((reg: RegExp | string) => {
          if (typeof reg === "string") {
            return route === reg;
          }
          return route.match(reg);
        })
      ) {
        return;
      }

      if (route === "404.html" || route === "search/index.html") {
        // Do not index error page and search page.
        return;
      }
      if (
        indexBlog &&
        blogRouteBasePath.some((basePath) => urlMatchesPrefix(route, basePath))
      ) {
        if (
          blogRouteBasePath.some(
            (basePath) =>
              route === basePath || urlMatchesPrefix(route, `${basePath}/tags`)
          )
        ) {
          // Do not index list of blog posts and tags filter pages
          return;
        }
        return { route, url, type: "blog" };
      }
      if (
        indexDocs &&
        docsRouteBasePath.some((basePath) => urlMatchesPrefix(route, basePath))
      ) {
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
