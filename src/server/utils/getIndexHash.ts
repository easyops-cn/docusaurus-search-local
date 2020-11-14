import fs from "fs";
import path from "path";
import crypto from "crypto";
import klawSync from "klaw-sync";
import { ProcessedPluginOptions } from "../../shared/interfaces";
import { debugInfo } from "./debug";

export function getIndexHash(config: ProcessedPluginOptions): string | null {
  if (!config.hashed) {
    return null;
  }
  const files: klawSync.Item[] = [];

  const scanFiles = (
    flagField: "indexDocs" | "indexBlog",
    dirField: "docsDir" | "blogDir"
  ): void => {
    if (config[flagField]) {
      for (const dir of config[dirField]) {
        if (!fs.existsSync(dir)) {
          console.warn(`Warn: \`${dirField}\` doesn't exist: "${dir}".`);
        } else if (!fs.lstatSync(dir).isDirectory()) {
          console.warn(`Warn: \`${dirField}\` is not a directory: "${dir}".`);
        } else {
          files.push(...klawSync(dir, { nodir: true, filter: markdownFilter }));
        }
      }
    }
  };

  scanFiles("indexDocs", "docsDir");
  scanFiles("indexBlog", "blogDir");

  if (files.length > 0) {
    const md5sum = crypto.createHash("md5");

    // The version of this plugin should be counted in hash,
    // since the index maybe changed between versions.

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pluginVersion = require(path.resolve(
      __dirname,
      "../../../../package.json"
    )).version;
    debugInfo("using @easyops-cn/docusaurus-search-local v%s", pluginVersion);
    md5sum.update(pluginVersion, "utf8");

    for (const item of files) {
      md5sum.update(fs.readFileSync(item.path));
    }

    const indexHash = md5sum.digest("hex").substring(0, 8);
    debugInfo("the index hash is %j", indexHash);
    return indexHash;
  }
  return null;
}

function markdownFilter(item: klawSync.Item): boolean {
  return item.path.endsWith(".md");
}
