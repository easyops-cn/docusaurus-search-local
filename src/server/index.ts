import path from "path";
import fs from "fs-extra";
import { DocusaurusContext, PluginOptions } from "../shared/interfaces";
import { processPluginOptions } from "./utils/processPluginOptions";
import { postBuildFactory } from "./utils/postBuildFactory";
import { generate } from "./utils/generate";

const PLUGIN_NAME = "@easyops-cn/docusaurus-search-local";

module.exports = function DocusaurusSearchLocalPlugin(
  context: DocusaurusContext,
  options?: PluginOptions
): any {
  const config = processPluginOptions(options, context.siteDir);

  const dir = path.join(context.generatedFilesDir, PLUGIN_NAME, "default");
  fs.ensureDirSync(dir);
  generate(config, dir);

  return {
    name: PLUGIN_NAME,
    getThemePath() {
      return path.resolve(__dirname, "../../client/client/theme");
    },
    postBuild: postBuildFactory(config),
  };
};
