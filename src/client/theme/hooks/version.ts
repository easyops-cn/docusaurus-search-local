import React, { useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { concat, head } from "lodash/fp";
import URI from "urijs";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function useDocusaurusDocsVersion() {
  const [version, setVersion] = useState<null | string>(null);
  const context = useDocusaurusContext();
  const location = useLocation();

  // tslint:disable-next-line: no-expression-statement
  useLayoutEffect(() => {
    async function determineVersion() {
      const { siteConfig = {} } = context;
      const { baseUrl, customFields = {}, url: origin } = siteConfig;
      const { routeBasePath = "docs" } = customFields;
      const routeBase = routeBasePath.endsWith("/")
        ? routeBasePath
        : `${routeBasePath}/`;

      const { pathname } = location;
      //const docsUri = URI(routeBase);
      const locationUri = URI(pathname).origin(origin);
      const docsUri = new URI(baseUrl + routeBase).origin(origin);
      const versionPath = locationUri.relativeTo(docsUri.toString());
      const maybeVersion = versionPath.segment(0);
      try {
        /* eslint-disable */
        // @ts-ignore
        const { default: knownVersions } = await import("@site/versions.json");
        /* eslint-enable */
        const currentVersion = concat(knownVersions, "next").includes(
          maybeVersion
        )
          ? maybeVersion
          : head(knownVersions);
        const versionString = currentVersion as string;
        setVersion(versionString);
      } catch (err) {
        console.error(err);
      }
    }

    determineVersion();
  }, [context, location]);

  return version;
}
