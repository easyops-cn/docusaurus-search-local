import path from "path";

import { DocusaurusContext, PluginOptions } from "../shared/interfaces";
import { processPluginOptions } from "./utils/processPluginOptions";
import { postBuildFactory } from "./utils/postBuildFactory";
import { generate } from "./utils/generate";

module.exports = function DocusaurusSearchLocalPlugin(
  context: DocusaurusContext,
  options?: PluginOptions
): any {
  const config = processPluginOptions(options, context.siteDir);

  generate(config);

  return {
    name: "@easyops-cn/docusaurus-search-local",
    getThemePath() {
      return path.resolve(__dirname, "../../client/client/theme");
    },
    postBuild: postBuildFactory(config),
  };
};
