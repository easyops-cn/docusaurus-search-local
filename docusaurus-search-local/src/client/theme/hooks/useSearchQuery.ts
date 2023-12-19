/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useHistory, useLocation } from "@docusaurus/router";
import useIsBrowser from "@docusaurus/useIsBrowser";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { searchContextByPaths } from "../../utils/proxiedGenerated";

const SEARCH_PARAM_QUERY = "q";
const SEARCH_PARAM_CONTEXT = "ctx";
const SEARCH_PARAM_VERSION = "version";

function useSearchQuery(): any {
  const isBrowser = useIsBrowser();
  const history = useHistory();
  const location = useLocation();
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const params = isBrowser ? new URLSearchParams(location.search) : null;
  const searchValue = params?.get(SEARCH_PARAM_QUERY) || "";
  const searchContext = params?.get(SEARCH_PARAM_CONTEXT) || "";
  const searchVersion = params?.get(SEARCH_PARAM_VERSION) || "";

  const getSearchParams = (searchValue: string): URLSearchParams => {
    const searchParams = new URLSearchParams(location.search);
    if (searchValue) {
      searchParams.set(SEARCH_PARAM_QUERY, searchValue);
    } else {
      searchParams.delete(SEARCH_PARAM_QUERY);
    }
    return searchParams;
  };

  return {
    searchValue,
    searchContext:
      searchContext &&
      Array.isArray(searchContextByPaths) &&
      searchContextByPaths.some((item) =>
        typeof item === "string"
          ? item === searchContext
          : item.path === searchContext
      )
        ? searchContext
        : "",
    searchVersion,
    updateSearchPath: (searchValue: string) => {
      const searchParams = getSearchParams(searchValue);
      history.replace({
        search: searchParams.toString(),
      });
    },
    updateSearchContext: (value: string) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set(SEARCH_PARAM_CONTEXT, value);
      history.replace({
        search: searchParams.toString(),
      });
    },
    generateSearchPageLink: (searchValue: string) => {
      const searchParams = getSearchParams(searchValue);
      // Refer to https://github.com/facebook/docusaurus/pull/2838
      return `${baseUrl}search?${searchParams.toString()}`;
    },
  };
}

export default useSearchQuery;
