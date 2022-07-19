import path from "path";
import {
  DocInfoWithFilePath,
  DocInfoWithRoute,
  VersionDocInfo,
  ProcessedPluginOptions,
  PostBuildData,
} from "../../shared/interfaces";
import { LoadedContent, LoadedVersion } from "@docusaurus/plugin-content-docs";
import { debugVerbose } from "./debug";

export function processDocInfos(
  { routesPaths, outDir, baseUrl, siteConfig, plugins }: PostBuildData,
  {
    indexDocs,
    indexBlog,
    indexPages,
    docsRouteBasePath,
    blogRouteBasePath,
    ignoreFiles,
  }: ProcessedPluginOptions
): VersionDocInfo[] {
  const emptySet = new Set<string>();
  let versionData = new Map([[outDir, emptySet]]);
  if (plugins) {
    // Handle docs multi-instance.
    const docsPlugins = plugins.filter(
      (item) => item.name === "docusaurus-plugin-content-docs"
    );
    const loadedVersions: LoadedVersion[] = docsPlugins.flatMap(
      (plugin) => (plugin.content as LoadedContent).loadedVersions
    );
    debugVerbose("loadedVersions:", loadedVersions);
    if (loadedVersions.length > 0) {
      versionData = new Map();
      for (const loadedVersion of loadedVersions) {
        const route = loadedVersion.path.substr(baseUrl.length);
        let versionOutDir = outDir;
        // The last versions search-index should always be placed in the root since it is the one used from non-docs pages
        if (!loadedVersion.isLast) {
          versionOutDir = path.join(
            outDir,
            ...route.split("/").filter((i: string) => i)
          );
        }
        // Merge docs which share the same `versionOutDir`.
        let docs = versionData.get(versionOutDir);
        if (!docs) {
          docs = new Set<string>();
          versionData.set(versionOutDir, docs);
        }
        for (const doc of loadedVersion.docs) {
          docs.add(doc.permalink);
        }
      }
      debugVerbose("versionData:", versionData);
    }
  }

  // Create a list of files to index per document version. This will always include all pages and blogs.
  const result = [];
  for (const [versionOutDir, docs] of versionData.entries()) {
    const versionPaths = routesPaths
      .map<DocInfoWithRoute | undefined>((url: string) => {
        // istanbul ignore next
        if (!url.startsWith(baseUrl)) {
          throw new Error(
            `The route must start with the baseUrl "${baseUrl}", but was "${url}". This is a bug, please report it.`
          );
        }
        const route = url.substr(baseUrl.length).replace(/\/$/, "");

        // Do not index homepage, error page and search page.
        if (
          ((!docsRouteBasePath || docsRouteBasePath[0] !== "") &&
            route === "") ||
          route === "404.html" ||
          route === "search"
        ) {
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
          blogRouteBasePath.some((basePath) =>
            isSameOrSubRoute(route, basePath)
          )
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
          docsRouteBasePath.some((basePath) =>
            isSameOrSubRoute(route, basePath)
          )
        ) {
          if (docs.size === 0 || docs.has(url)) {
            return { route, url, type: "docs" };
          }
          return;
        }
        if (indexPages) {
          return { route, url, type: "page" };
        }
        return;
      })
      .filter<DocInfoWithRoute>(Boolean as any)
      .map<DocInfoWithFilePath>(({ route, url, type }) => ({
        filePath: path.join(
          outDir,
          siteConfig.trailingSlash === false && route != ""
            ? `${route}.html`
            : `${route}/index.html`
        ),
        url,
        type,
      }));
    if (versionPaths.length > 0) {
      result.push({ outDir: versionOutDir, paths: versionPaths });
    }
  }

  return result;
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
