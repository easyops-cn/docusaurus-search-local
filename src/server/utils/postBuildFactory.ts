import fs from "fs";
import path from "path";
import util from "util";
import _debug from "debug";
import { ProcessedPluginOptions, PostBuildData } from "../../shared/interfaces";
import { buildIndex } from "./buildIndex";
import { processDocInfos } from "./processDocInfos";
import { scanDocuments } from "./scanDocuments";

const debug = _debug("search-local");
const writeFileAsync = util.promisify(fs.writeFile);

export function postBuildFactory(config: ProcessedPluginOptions) {
  return async function postBuild(buildData: PostBuildData): Promise<void> {
    debug("Gathering documents");

    const data = processDocInfos(buildData, config);

    debug("Parsing documents");

    // Give every index entry a unique id so that the index does not need to store long URLs.
    const allDocuments = await scanDocuments(data);

    debug("Building index");

    const searchIndex = buildIndex(allDocuments, config);

    debug("Writing index to disk");

    await writeFileAsync(
      path.join(buildData.outDir, "search-index.json"),
      JSON.stringify(searchIndex),
      { encoding: "utf8" }
    );

    debug("Index written to disk, success!");
  };
}
