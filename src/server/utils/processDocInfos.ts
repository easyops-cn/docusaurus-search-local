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
      if (route === "404.html") {
        // Do not index error page.
        return;
      }
      if (indexBlog && urlMatchesPrefix(route, blogRouteBasePath)) {
        if (
          route === blogRouteBasePath ||
          urlMatchesPrefix(route, `${blogRouteBasePath}/tags`)
        ) {
          // Do not index list of blog posts and tags filter pages
          return;
        }
        return { route, url, type: "blog" };
      }
      if (indexDocs && urlMatchesPrefix(route, docsRouteBasePath)) {
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
