/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useHistory, useLocation } from "@docusaurus/router";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  searchContextByPaths,
} from "../../utils/proxiedGenerated";

const SEARCH_PARAM_QUERY = "q";
const SEARCH_PARAM_CONTEXT = "ctx";

function useSearchQuery(): any {
  const history = useHistory();
  const location = useLocation();
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const params = ExecutionEnvironment.canUseDOM ? new URLSearchParams(location.search) : null;
  const searchValue = params?.get(SEARCH_PARAM_QUERY) || "";
  const searchContext = params?.get(SEARCH_PARAM_CONTEXT) || "";

  return {
    searchValue,
    searchContext,
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
      const searchParams = new URLSearchParams(location.search);
      const searchContext = searchParams.get(SEARCH_PARAM_CONTEXT) || "";
      // Refer to https://github.com/facebook/docusaurus/pull/2838
      return `${baseUrl}search?q=${encodeURIComponent(searchValue)}${
        Array.isArray(searchContextByPaths) ? `&ctx=${encodeURIComponent(searchContext)}` : ""
      }`;
    },
  };
}

export default useSearchQuery;
