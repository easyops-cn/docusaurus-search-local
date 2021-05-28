import path from "path";
import { PluginOptions, ProcessedPluginOptions } from "../../shared/interfaces";

export function processPluginOptions(
  options: PluginOptions | undefined,
  siteDir: string
): ProcessedPluginOptions {
  const config = { ...options } as ProcessedPluginOptions;
  ensureArray(config, "docsRouteBasePath");
  ensureArray(config, "blogRouteBasePath");
  ensureArray(config, "language");
  ensureArray(config, "docsDir");
  ensureArray(config, "blogDir");
  ensureArray(config, "ignoreFiles");
  config.docsRouteBasePath = config.docsRouteBasePath.map((basePath) =>
    basePath.replace(/^\//, "")
  );
  config.blogRouteBasePath = config.blogRouteBasePath.map((basePath) =>
    basePath.replace(/^\//, "")
  );
  config.docsDir = config.docsDir.map((dir) => path.resolve(siteDir, dir));
  config.blogDir = config.blogDir.map((dir) => path.resolve(siteDir, dir));
  return config;
}

function ensureArray<T>(object: T, key: keyof T): void {
  if (!Array.isArray(object[key])) {
    (object as any)[key] = [object[key]];
  }
}
