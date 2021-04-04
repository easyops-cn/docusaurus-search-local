/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useHistory, useLocation } from "@docusaurus/router";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const SEARCH_PARAM_QUERY = "q";
const SEARCH_PARAM_VERSION = "v";

function useSearchQuery(): any {
  const history = useHistory();
  const location = useLocation();
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  return {
    searchValue:
      (ExecutionEnvironment.canUseDOM &&
        new URLSearchParams(location.search).get(SEARCH_PARAM_QUERY)) ||
      "",
    searchVersion:
      (ExecutionEnvironment.canUseDOM &&
        new URLSearchParams(location.search).get(SEARCH_PARAM_VERSION)) ||
      "",
    updateSearchPath: (searchValue: string) => {
      const searchParams = new URLSearchParams(location.search);

      if (searchValue) {
        searchParams.set(SEARCH_PARAM_QUERY, searchValue);
      } else {
        searchParams.delete(SEARCH_PARAM_QUERY);
      }

      history.replace({
        search: searchParams.toString(),
      });
    },
    generateSearchPageLink: (searchValue: string) => {
      // Refer to https://github.com/facebook/docusaurus/pull/2838
      return `${baseUrl}search?q=${encodeURIComponent(searchValue)}`;
    },
  };
}

export default useSearchQuery;
