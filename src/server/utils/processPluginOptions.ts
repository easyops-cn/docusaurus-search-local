import path from "path";
import { PluginOptions, ProcessedPluginOptions } from "../../shared/interfaces";

export function processPluginOptions(
  options: PluginOptions | undefined,
  siteDir: string
): ProcessedPluginOptions {
  const config = Object.assign(
    {
      indexDocs: true,
      indexBlog: true,
      indexPages: false,
      docsRouteBasePath: "/docs",
      blogRouteBasePath: "/blog",
      language: "en",
      hashed: false,
      docsDir: "docs",
      blogDir: "blog",
      removeDefaultStopWordFilter: false,
      searchResultLimits: 8,
      searchResultContextMaxLength: 50,
    },
    options
  ) as ProcessedPluginOptions;
  config.docsRouteBasePath = (config.docsRouteBasePath as string).replace(
    /^\//,
    ""
  );
  config.blogRouteBasePath = (config.blogRouteBasePath as string).replace(
    /^\//,
    ""
  );
  config.docsDir = path.resolve(siteDir, config.docsDir);
  config.blogDir = path.resolve(siteDir, config.blogDir);
  if (!Array.isArray(config.language)) {
    config.language = [config.language];
  }
  return config;
}
