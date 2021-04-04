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

import { fetchIndexes } from "./fetchIndexes";
import { SearchSourceFactory } from "../../utils/SearchSourceFactory";
import { SuggestionTemplate } from "./SuggestionTemplate";
import { EmptyTemplate } from "./EmptyTemplate";
import { SearchResult } from "../../../shared/interfaces";
import {
  searchResultLimits,
  Mark,
  translations,
} from "../../utils/proxiedGenerated";
import LoadingRing from "../LoadingRing/LoadingRing";
import useDocusaurusDocsVersion from "../hooks/version";
import styles from "./SearchBar.module.css";

async function fetchAutoCompleteJS(): Promise<any> {
  const autoComplete = await import("@easyops-cn/autocomplete.js");
  autoComplete.noConflict();
  return autoComplete.default;
}

const SEARCH_PARAM_HIGHLIGHT = "_highlight";

interface SearchBarProps {
  isSearchBarExpanded: boolean;
  handleSearchBarToggle: (expanded: boolean) => void;
}

export default function SearchBar({
  handleSearchBarToggle,
}: SearchBarProps): ReactElement {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const history = useHistory();
  const location = useLocation();
  const searchBarRef = useRef<HTMLInputElement>(null);
  const indexState = useRef("empty"); // empty, loaded, done
  // Should the input be focused after the index is loaded?
  const focusAfterIndexLoaded = useRef(false);
  const [loading, setLoading] = useState(false);
  const [inputChanged, setInputChanged] = useState(false);
  const version = useDocusaurusDocsVersion();

  const loadIndex = useCallback(async () => {
    if (indexState.current !== "empty") {
      // Do not load the index (again) if its already loaded or in the process of being loaded.
      return;
    }
    indexState.current = "loading";
    setLoading(true);
    const [{ wrappedIndexes, zhDictionary }, autoComplete] = await Promise.all([
      fetchIndexes(baseUrl),
      fetchAutoCompleteJS(),
    ]);

    const search = autoComplete(
      searchBarRef.current,
      {
        hint: false,
        autoselect: true,
        cssClasses: {
          root: styles.searchBar,
          noPrefix: true,
          dropdownMenu: styles.dropdownMenu,
          input: styles.input,
          hint: styles.hint,
          suggestions: styles.suggestions,
          suggestion: styles.suggestion,
          cursor: styles.cursor,
          dataset: styles.dataset,
          empty: styles.empty,
        },
      },
      [
        {
          source: SearchSourceFactory(
            wrappedIndexes,
            zhDictionary,
            searchResultLimits,
            version
          ),
          templates: {
            suggestion: SuggestionTemplate,
            empty: EmptyTemplate,
            footer: ({ query, isEmpty }: any) => {
              if (isEmpty) {
                return;
              }
              const a = document.createElement("a");
              const url = `${baseUrl}search?q=${encodeURIComponent(query)}`;
              a.href = url;
              a.textContent = translations.see_all_results;
              a.addEventListener("click", (e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  search.autocomplete.close();
                  history.push(url);
                }
              });
              const div = document.createElement("div");
              div.className = styles.hitFooter;
              div.appendChild(a);
              return div;
            },
          },
        },
      ]
    ).on("autocomplete:selected", function (
      event: any,
      { document: { u, h }, tokens }: SearchResult
    ) {
      let url = u;
      if (Mark && tokens.length > 0) {
        const params = new URLSearchParams();
        for (const token of tokens) {
          params.append(SEARCH_PARAM_HIGHLIGHT, token);
        }
        url += `?${params.toString()}`;
      }
      if (h) {
        url += h;
      }
      history.push(url);
    });

    indexState.current = "done";
    setLoading(false);

    if (focusAfterIndexLoaded.current) {
      const input = searchBarRef.current as HTMLInputElement;
      if (input.value) {
        search.autocomplete.open();
      }
      input.focus();
    }
  }, [baseUrl, history, version]);

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
    const root = document.querySelector("article");
    if (!root) {
      return;
    }
    const mark = new Mark(root);
    mark.unmark();
    mark.mark(keywords);
  }, [location.search]);

  const onInputFocus = useCallback(() => {
    focusAfterIndexLoaded.current = true;
    loadIndex();
    handleSearchBarToggle(true);
  }, [handleSearchBarToggle, loadIndex]);

  const onInputBlur = useCallback(() => {
    handleSearchBarToggle(false);
  }, [handleSearchBarToggle]);

  const onInputMouseEnter = useCallback(() => {
    loadIndex();
  }, [loadIndex]);

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value) {
        setInputChanged(true);
      }
    },
    []
  );

  return (
    <div
      className={clsx("navbar__search", styles.searchBarContainer, {
        [styles.searchIndexLoading]: loading && inputChanged,
      })}
    >
      <input
        placeholder={translations.search_placeholder}
        aria-label="Search"
        className="navbar__search-input"
        onMouseEnter={onInputMouseEnter}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        onChange={onInputChange}
        ref={searchBarRef}
      />
      <LoadingRing className={styles.searchBarLoadingRing} />
    </div>
  );
}
