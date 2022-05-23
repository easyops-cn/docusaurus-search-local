import fs from "fs";
import path from "path";
import util from "util";
import { ProcessedPluginOptions, PostBuildData } from "../../shared/interfaces";
import { buildIndex } from "./buildIndex";
import { debugInfo } from "./debug";
import { processDocInfos } from "./processDocInfos";
import { scanDocuments } from "./scanDocuments";

const writeFileAsync = util.promisify(fs.writeFile);

export function postBuildFactory(config: ProcessedPluginOptions) {
  return async function postBuild(buildData: PostBuildData): Promise<void> {
    debugInfo("gathering documents");

    const data = processDocInfos(buildData, config);

    debugInfo("parsing documents");

    for (let versionData of data) {
      // Give every index entry a unique id so that the index does not need to store long URLs.
      const allDocuments = await scanDocuments(versionData.paths);

      debugInfo("building index");

      const searchIndex = buildIndex(allDocuments, config);

      debugInfo("writing index to disk");

      await writeFileAsync(
        path.join(versionData.outDir, "search-index.json"),
        JSON.stringify(searchIndex),
        { encoding: "utf8" }
      );

      debugInfo("index written to disk successfully!");
    }
  };
}
