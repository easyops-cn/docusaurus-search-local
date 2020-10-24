import fs from "fs";
import crypto from "crypto";
import klawSync from "klaw-sync";
import { ProcessedPluginOptions } from "../../shared/interfaces";

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
      if (!fs.existsSync(config[dirField])) {
        console.warn(
          `Warn: \`${dirField}\` doesn't exist: "${config[dirField]}".`
        );
      } else if (!fs.lstatSync(config[dirField]).isDirectory()) {
        console.warn(
          `Warn: \`${dirField}\` is not a directory: "${config[dirField]}".`
        );
      } else {
        files.push(
          ...klawSync(config[dirField], { nodir: true, filter: markdownFilter })
        );
      }
    }
  };

  scanFiles("indexDocs", "docsDir");
  scanFiles("indexBlog", "blogDir");

  if (files.length > 0) {
    const md5sum = crypto.createHash("md5");
    for (const item of files) {
      md5sum.update(fs.readFileSync(item.path));
    }
    return md5sum.digest("hex").substring(0, 8);
  }
  return null;
}

function markdownFilter(item: klawSync.Item): boolean {
  return item.path.endsWith(".md");
}