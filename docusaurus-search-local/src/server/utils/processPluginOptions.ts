import path from "path";
import {
  DocusaurusContext,
  PluginOptions,
  ProcessedPluginOptions,
} from "../../shared/interfaces";

export function processPluginOptions(
  options: PluginOptions | undefined,
  {
    siteDir,
    siteConfig: { themeConfig },
  }: Pick<DocusaurusContext, "siteDir" | "siteConfig">
): ProcessedPluginOptions {
  const config = { ...options } as ProcessedPluginOptions;
  ensureArray(config, "docsRouteBasePath");
  ensureArray(config, "blogRouteBasePath");
  ensureArray(config, "language");
  ensureArray(config, "docsDir");
  ensureArray(config, "blogDir");
  ensureArray(config, "ignoreFiles");
  ensureArray(config, "ignoreClasses");
  config.docsRouteBasePath = config.docsRouteBasePath.map((basePath) =>
    basePath.replace(/^\//, "")
  );
  config.blogRouteBasePath = config.blogRouteBasePath.map((basePath) =>
    basePath.replace(/^\//, "")
  );
  config.docsDir = config.docsDir.map((dir) => path.resolve(siteDir, dir));
  config.blogDir = config.blogDir.map((dir) => path.resolve(siteDir, dir));
  if (config.searchBarPosition === "auto") {
    const search = themeConfig.navbar?.items?.find(
      (item) => item.type === "search"
    );
    config.searchBarPosition =
      search && search.position === "left" ? "left" : "right";
  }
  return config;
}

function ensureArray<T>(object: T, key: keyof T): void {
  if (!Array.isArray(object[key])) {
    (object as any)[key] = [object[key]];
  }
}
