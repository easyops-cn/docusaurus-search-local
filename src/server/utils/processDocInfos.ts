import path from "path";
import {
  DocInfoWithFilePath,
  DocInfoWithRoute,
  ProcessedPluginOptions,
  PostBuildData,
} from "../../shared/interfaces";

export function processDocInfos(
  { routesPaths, outDir, baseUrl, siteConfig }: PostBuildData,
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
      const route = url.substr(baseUrl.length).replace(/\/$/, "");

      // Do not index homepage, error page and search page.
      if (route === "" || route === "404.html" || route === "search") {
        return;
      }

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

      if (
        indexBlog &&
        blogRouteBasePath.some((basePath) => isSameOrSubRoute(route, basePath))
      ) {
        if (
          blogRouteBasePath.some(
            (basePath) =>
              isSameRoute(route, basePath) ||
              isSameOrSubRoute(route, path.posix.join(basePath, "tags"))
          )
        ) {
          // Do not index list of blog posts and tags filter pages
          return;
        }
        return { route, url, type: "blog" };
      }
      if (
        indexDocs &&
        docsRouteBasePath.some((basePath) => isSameOrSubRoute(route, basePath))
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
      filePath: path.join(
        outDir,
        siteConfig.trailingSlash === false
          ? `${route}.html`
          : `${route}/index.html`
      ),
      url,
      type,
    }));
}

function isSameRoute(routeA: string, routeB: string): boolean {
  return addTrailingSlash(routeA) === addTrailingSlash(routeB);
}

function isSameOrSubRoute(childRoute: string, parentRoute: string): boolean {
  return (
    parentRoute === "" ||
    addTrailingSlash(childRoute).startsWith(addTrailingSlash(parentRoute))
  );
}

// The input route must not end with a slash.
function addTrailingSlash(route: string): string {
  return `${route}/`;
}
