import fs from "fs";
import crypto from "crypto";
import klawSync from "klaw-sync";
import { ProcessedPluginOptions } from "../../shared/interfaces";

export function getIndexHash(config: ProcessedPluginOptions): string | null {
  if (!config.hashed) {
    return null;
  }
  const files: klawSync.Item[] = [];
  if (config.indexDocs) {
    files.push(
      ...klawSync(config.docsDir, { nodir: true, filter: markdownFilter })
    );
  }
  if (config.indexBlog) {
    files.push(
      ...klawSync(config.blogDir, { nodir: true, filter: markdownFilter })
    );
  }
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
