import fs from "fs";
import klawSync from "klaw-sync";
import { ProcessedPluginOptions } from "../../shared/interfaces";
import { getIndexHash } from "./getIndexHash";

jest.mock("klaw-sync");
jest.mock("fs");

(klawSync as jest.MockedFunction<typeof klawSync>).mockImplementation(
  (root, options) => {
    let files: string[] = [];
    if (root === "/tmp/docs") {
      files = ["/tmp/docs/a.md", "/tmp/docs/b.md", "/tmp/docs/b.png"];
    }
    return files
      .map((path) => ({ path } as klawSync.Item))
      .filter(options.filter);
  }
);

(fs.readFileSync as jest.MockedFunction<
  typeof fs.readFileSync
>).mockImplementation((filePath: string) => {
  if (filePath.endsWith(".md")) {
    return Buffer.from(filePath);
  }
  throw new Error(`Unknown file: ${filePath}`);
});

describe("getIndexHash", () => {
  test.each<[Partial<ProcessedPluginOptions>, string | null]>([
    [{ hashed: false }, null],
    [{ hashed: true, indexDocs: true, docsDir: "/tmp/docs" }, "a387bd69"],
    [{ hashed: true, indexBlog: true, blogDir: "/tmp/blog" }, null],
  ])("getIndexHash(%j) should return '%s'", (config, hash) => {
    expect(getIndexHash(config as ProcessedPluginOptions)).toBe(hash);
  });
});
