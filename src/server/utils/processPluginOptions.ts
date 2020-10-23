import path from "path";
import { PluginOptions, ProcessedPluginOptions } from "../../shared/interfaces";

export function processPluginOptions(
  options: PluginOptions | undefined,
  siteDir: string
): ProcessedPluginOptions {
  const config = { ...options } as ProcessedPluginOptions;
  config.docsDir = path.resolve(siteDir, config.docsDir);
  config.blogDir = path.resolve(siteDir, config.blogDir);
  if (!Array.isArray(config.language)) {
    config.language = [config.language];
  }
  return config;
}
