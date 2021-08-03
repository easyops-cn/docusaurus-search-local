import path from "path";
import fs from "fs-extra";
import { normalizeUrl } from "@docusaurus/utils";
import { DocusaurusContext, PluginOptions } from "../shared/interfaces";
import { processPluginOptions } from "./utils/processPluginOptions";
import { postBuildFactory } from "./utils/postBuildFactory";
import { generate } from "./utils/generate";

const PLUGIN_NAME = "@easyops-cn/docusaurus-search-local";

export default function DocusaurusSearchLocalPlugin(
  context: DocusaurusContext,
  options?: PluginOptions
): any {
  const config = processPluginOptions(options, context.siteDir);

  const dir = path.join(context.generatedFilesDir, PLUGIN_NAME, "default");
  fs.ensureDirSync(dir);
  generate(config, dir);

  const themePath = path.resolve(__dirname, "../../client/client/theme");
  const pagePath = path.join(themePath, "SearchPage/index.js");

  return {
    name: PLUGIN_NAME,

    getThemePath() {
      return themePath;
    },

    postBuild: postBuildFactory(config, context.siteConfig),

    getPathsToWatch() {
      return [pagePath];
    },

    async contentLoaded({ actions: { addRoute } }: any) {
      addRoute({
        path: normalizeUrl([context.baseUrl, "search"]),
        component: "@theme/SearchPage",
        exact: true,
      });
    },
  };
}

export { validateOptions } from "./utils/validateOptions";
