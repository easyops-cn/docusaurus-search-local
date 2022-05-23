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

import { fetchIndexes } from "./fetchIndexes";
import { SearchSourceFactory } from "../../utils/SearchSourceFactory";
import { SuggestionTemplate } from "./SuggestionTemplate";
import { EmptyTemplate } from "./EmptyTemplate";
import { SearchResult } from "../../../shared/interfaces";
import { searchResultLimits, Mark } from "../../utils/proxiedGenerated";
import LoadingRing from "../LoadingRing/LoadingRing";

import styles from "./SearchBar.module.css";

async function fetchAutoCompleteJS(): Promise<any> {
  const autoCompleteModule = await import("@easyops-cn/autocomplete.js");
  const autoComplete = autoCompleteModule.default;
  if (autoComplete.noConflict) {
    // For webpack v5 since docusaurus v2.0.0-alpha.75
    autoComplete.noConflict();
  } else if (autoCompleteModule.noConflict) {
    // For webpack v4 before docusaurus v2.0.0-alpha.74
    autoCompleteModule.noConflict();
  }
  return autoComplete;
}

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
  const searchBarRef = useRef<HTMLInputElement>(null);
  let search: any = null;
  const indexState = useRef("empty"); // empty, loaded, done
  // Should the input be focused after the index is loaded?
  const focusAfterIndexLoaded = useRef(false);
  const [loading, setLoading] = useState(false);
  const [inputChanged, setInputChanged] = useState(false);
  const [inputValue, setInputValue] = useState("");

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

    search = autoComplete(
      searchBarRef.current,
      {
        hint: false,
        autoselect: true,
        openOnFocus: true,
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
            searchResultLimits
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
              a.textContent = translate({
                id: "theme.SearchBar.seeAll",
                message: "See all results",
              });
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
    )
      .on(
        "autocomplete:selected",
        function (event: any, { document: { u, h }, tokens }: SearchResult) {
          searchBarRef.current?.blur();

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
        }
      )
      .on("autocomplete:closed", () => {
        searchBarRef.current?.blur();
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
  }, [baseUrl, history]);

  useEffect(() => {
    if (!Mark) {
      return;
    }
    const keywords = ExecutionEnvironment.canUseDOM
      ? new URLSearchParams(location.search).getAll(SEARCH_PARAM_HIGHLIGHT)
      : [];
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
      if (keywords.length !== 0) {
        mark.mark(keywords);
      }
      setInputValue(keywords.join(" "));
      search?.autocomplete.setVal(keywords.join(" "));
    });
  }, [location.search, location.pathname]);

  const onInputFocus = useCallback(() => {
    focusAfterIndexLoaded.current = true;
    loadIndex();
    handleSearchBarToggle?.(true);
  }, [handleSearchBarToggle, loadIndex]);

  const onInputBlur = useCallback(() => {
    handleSearchBarToggle?.(false);
  }, [handleSearchBarToggle]);

  const onInputMouseEnter = useCallback(() => {
    loadIndex();
  }, [loadIndex]);

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      if (event.target.value) {
        setInputChanged(true);
      }
    },
    []
  );

  // Implement hint icons for the search shortcuts on mac and the rest operating systems.
  const isMac = ExecutionEnvironment.canUseDOM
    ? /mac/i.test(
        (navigator as any).userAgentData?.platform ?? navigator.platform
      )
    : false;

  useEffect(() => {
    // Add shortcuts command/ctrl + K
    function handleShortcut(event: KeyboardEvent): void {
      if ((isMac ? event.metaKey : event.ctrlKey) && event.code === "KeyK") {
        event.preventDefault();
        searchBarRef.current?.focus();
        onInputFocus();
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [isMac, onInputFocus]);

  const onClearSearch = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete(SEARCH_PARAM_HIGHLIGHT);
    history.push(
      window.location.pathname + `?${params.toString()}` + window.location.hash
    );
    setInputValue("");
    search?.autocomplete.setVal("");
  }, []);

  return (
    <div
      className={clsx("navbar__search", styles.searchBarContainer, {
        [styles.searchIndexLoading]: loading && inputChanged,
      })}
    >
      <input
        placeholder={translate({
          id: "theme.SearchBar.label",
          message: "Search",
          description: "The ARIA label and placeholder for search button",
        })}
        aria-label="Search"
        className="navbar__search-input"
        onMouseEnter={onInputMouseEnter}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        onChange={onInputChange}
        ref={searchBarRef}
        value={inputValue}
      />
      <LoadingRing className={styles.searchBarLoadingRing} />
      {inputValue !== "" ? (
        <button className={styles.searchClearButton} onClick={onClearSearch}>
          ✕
        </button>
      ) : (
        <div className={styles.searchHintContainer}>
          <kbd className={styles.searchHint}>{isMac ? "⌘" : "ctrl"}</kbd>
          <kbd className={styles.searchHint}>K</kbd>
        </div>
      )}
    </div>
  );
}
