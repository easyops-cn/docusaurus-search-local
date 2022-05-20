import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { useHistory, useLocation } from "@docusaurus/router";
import { translate } from "@docusaurus/Translate";
import { autocomplete } from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";

import { fetchIndexes } from "./fetchIndexes";
import { SearchSourceFactory } from "../../utils/SearchSourceFactory";
import { SuggestionTemplate } from "./SuggestionTemplate";
import { EmptyTemplate } from "./EmptyTemplate";
import { SearchResult } from "../../../shared/interfaces";
import { searchResultLimits, Mark } from "../../utils/proxiedGenerated";
import LoadingRing from "../LoadingRing/LoadingRing";

import styles from "./SearchBar.module.css";

// async function fetchAutoCompleteJS(): Promise<typeof autocomplete> {
//   const { autocomplete } = await import("@algolia/autocomplete-js");
//   return autocomplete;
// }

const SEARCH_PARAM_HIGHLIGHT = "_highlight";

interface SearchBarProps {
  isSearchBarExpanded: boolean;
  handleSearchBarToggle?: (expanded: boolean) => void;
}

export default function SearchBar({
  handleSearchBarToggle,
}: SearchBarProps): ReactElement {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const history = useHistory();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const indexState = useRef("empty"); // empty, loaded, done
  // Should the input be focused after the index is loaded?
  const focusAfterIndexLoaded = useRef(false);
  const [loading, setLoading] = useState(false);
  const [inputChanged, setInputChanged] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const search = autocomplete({
        container: containerRef.current as HTMLElement,
        defaultActiveItemId: 0,
        openOnFocus: true,
        debug: true,
        getSources() {
          return [
            {
              sourceId: "links",
              getItems({ query }) {
                return [
                  { label: "Twitter", url: "https://twitter.com" },
                  { label: "GitHub", url: "https://github.com" },
                ].filter(({ label }) =>
                  label.toLowerCase().includes(query.toLowerCase())
                );
              },
              getItemUrl({ item }) {
                return item.url as string;
              },
              templates: {
                header() {
                  return "Suggestions";
                },
                item({ item }) {
                  return `Result: ${item.label as string}`;
                },
                footer() {
                  return "Footer";
                },
              },
            },
          ];
        },
      });
      return () => {
        search.destroy();
      };
    }
  }, []);

  const loadIndex = useCallback(async () => {
    if (indexState.current !== "empty") {
      // Do not load the index (again) if its already loaded or in the process of being loaded.
      return;
    }
    indexState.current = "loading";
    setLoading(true);

    const { wrappedIndexes, zhDictionary } = await fetchIndexes(baseUrl);
  }, [baseUrl, history]);

  useEffect(() => {
    if (!Mark) {
      return;
    }
    const keywords = ExecutionEnvironment.canUseDOM
      ? new URLSearchParams(location.search).getAll(SEARCH_PARAM_HIGHLIGHT)
      : [];
    if (keywords.length === 0) {
      return;
    }
    // A workaround to fix an issue of highlighting in code blocks.
    // See https://github.com/easyops-cn/docusaurus-search-local/issues/92
    // Code blocks will be re-rendered after this `useEffect` ran.
    // So we make the marking run after a macro task.
    setTimeout(() => {
      const root = document.querySelector("article");
      if (!root) {
        return;
      }
      const mark = new Mark(root);
      mark.unmark();
      mark.mark(keywords);
    });
  }, [location.search, location.pathname]);

  return (
    <div
      className="navbar__search"
      // className={clsx("navbar__search", styles.searchBarContainer, {
      //   [styles.searchIndexLoading]: loading && inputChanged,
      // })}
      ref={containerRef}
    />
  );
}
