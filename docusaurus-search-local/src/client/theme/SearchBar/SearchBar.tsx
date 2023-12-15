import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { useHistory, useLocation } from "@docusaurus/router";
import { translate } from "@docusaurus/Translate";
import {
  ReactContextError,
  useDocsPreferredVersion,
} from "@docusaurus/theme-common";
import { useActivePlugin } from "@docusaurus/plugin-content-docs/client";

import { fetchIndexes } from "./fetchIndexes";
import { SearchSourceFactory } from "../../utils/SearchSourceFactory";
import { SuggestionTemplate } from "./SuggestionTemplate";
import { EmptyTemplate } from "./EmptyTemplate";
import { SearchResult } from "../../../shared/interfaces";
import {
  searchResultLimits,
  Mark,
  searchBarShortcut,
  searchBarShortcutHint,
  searchBarPosition,
  docsPluginIdForPreferredVersion,
  indexDocs,
  searchContextByPaths,
  hideSearchBarWithNoSearchContext,
} from "../../utils/proxiedGenerated";
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
  const isBrowser = useIsBrowser();
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  // It returns undefined for non-docs pages
  const activePlugin = useActivePlugin();
  let versionUrl = baseUrl;

  // For non-docs pages while using plugin-content-docs with custom ids,
  // this will throw an error of:
  //   > Docusaurus plugin global data not found for "docusaurus-plugin-content-docs" plugin with id "default".
  // It seems that we can not get the correct id for non-docs pages.
  try {
    // The try-catch is a hack because useDocsPreferredVersion just throws an
    // exception when versions are not used.
    // The same hack is used in SearchPage.tsx
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { preferredVersion } = useDocsPreferredVersion(
      activePlugin?.pluginId ?? docsPluginIdForPreferredVersion
    );
    if (preferredVersion && !preferredVersion.isLast) {
      versionUrl = preferredVersion.path + "/";
    }
  } catch (e: unknown) {
    if (indexDocs) {
      if (e instanceof ReactContextError) {
        /* ignore, happens when website doesn't use versions */
      } else {
        throw e;
      }
    }
  }
  const history = useHistory();
  const location = useLocation();
  const searchBarRef = useRef<HTMLInputElement>(null);
  const indexStateMap = useRef(new Map<string, "loading" | "done">());
  // Should the input be focused after the index is loaded?
  const focusAfterIndexLoaded = useRef(false);
  const [loading, setLoading] = useState(false);
  const [inputChanged, setInputChanged] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const search = useRef<any>(null);

  const prevSearchContext = useRef<string>("");
  const [searchContext, setSearchContext] = useState<string>("");
  useEffect(() => {
    if (!Array.isArray(searchContextByPaths)) {
      return;
    }
    let nextSearchContext = "";
    if (location.pathname.startsWith(versionUrl)) {
      const uri = location.pathname.substring(versionUrl.length);
      let matchedPath: string | undefined;
      for (const _path of searchContextByPaths) {
        const path = typeof _path === "string" ? _path : _path.path;
        if (uri === path || uri.startsWith(`${path}/`)) {
          matchedPath = path;
          break;
        }
      }
      if (matchedPath) {
        nextSearchContext = matchedPath;
      }
    }
    if (prevSearchContext.current !== nextSearchContext) {
      // Reset index state map once search context is changed.
      indexStateMap.current.delete(nextSearchContext);
      prevSearchContext.current = nextSearchContext;
    }
    setSearchContext(nextSearchContext);
  }, [location.pathname, versionUrl]);

  const hidden =
    !!hideSearchBarWithNoSearchContext &&
    Array.isArray(searchContextByPaths) &&
    searchContext === "";

  const loadIndex = useCallback(async () => {
    if (hidden || indexStateMap.current.get(searchContext)) {
      // Do not load the index (again) if its already loaded or in the process of being loaded.
      return;
    }
    indexStateMap.current.set(searchContext, "loading");
    search.current?.autocomplete.destroy();
    setLoading(true);

    const [{ wrappedIndexes, zhDictionary }, autoComplete] = await Promise.all([
      fetchIndexes(versionUrl, searchContext),
      fetchAutoCompleteJS(),
    ]);

    const searchFooterLinkElement = ({
      query,
      isEmpty,
    }: {
      query: string;
      isEmpty: boolean;
    }): HTMLAnchorElement => {
      const a = document.createElement("a");
      const params = new URLSearchParams();

      const seeAllResultsText = translate({
        id: "theme.SearchBar.seeAll",
        message: "See all results",
      });

      const seeAllResultsOutsideContextText = translate(
        {
          id: "theme.SearchBar.seeAllOutsideContext",
          message: "See results outside {context}",
        },
        { context: searchContext }
      );

      const seeAllResultsInContextText = translate(
        {
          id: "theme.SearchBar.searchInContext",
          message: "See all results in {context}",
        },
        { context: searchContext }
      );

      params.set("q", query);

      let linkText;
      if (searchContext && isEmpty) {
        linkText = seeAllResultsOutsideContextText;
      } else if (searchContext) {
        linkText = seeAllResultsInContextText;
      } else {
        linkText = seeAllResultsText;
      }

      if (Array.isArray(searchContextByPaths) && !isEmpty) {
        params.set("ctx", searchContext);
      }

      if (versionUrl !== baseUrl) {
        if (!versionUrl.startsWith(baseUrl)) {
          throw new Error(
            `Version url '${versionUrl}' does not start with base url '${baseUrl}', this is a bug of \`@easyops-cn/docusaurus-search-local\`, please report it.`
          );
        }
        params.set("version", versionUrl.substring(baseUrl.length));
      }
      const url = `${baseUrl}search?${params.toString()}`;
      a.href = url;
      a.textContent = linkText;
      a.addEventListener("click", (e) => {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          search.current?.autocomplete.close();
          history.push(url);
        }
      });
      return a;
    };

    search.current = autoComplete(
      searchBarRef.current,
      {
        hint: false,
        autoselect: true,
        openOnFocus: true,
        cssClasses: {
          root: clsx(styles.searchBar, {
            [styles.searchBarLeft]: searchBarPosition === "left",
          }),
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
              if (isEmpty && !searchContext) {
                return;
              }
              const a = searchFooterLinkElement({ query, isEmpty });
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

    indexStateMap.current.set(searchContext, "done");
    setLoading(false);

    if (focusAfterIndexLoaded.current) {
      const input = searchBarRef.current as HTMLInputElement;
      if (input.value) {
        search.current?.autocomplete.open();
      }
      input.focus();
    }
  }, [hidden, searchContext, versionUrl, baseUrl, history]);

  useEffect(() => {
    if (!Mark) {
      return;
    }
    const keywords = isBrowser
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

      // Apply any keywords to the search input so that we can clear marks in case we loaded a page with a highlight in the url
      setInputValue(keywords.join(" "));
      search.current?.autocomplete.setVal(keywords.join(" "));
    });
  }, [isBrowser, location.search, location.pathname]);

  const [focused, setFocused] = useState(false);

  const onInputFocus = useCallback(() => {
    focusAfterIndexLoaded.current = true;
    loadIndex();
    setFocused(true);
    handleSearchBarToggle?.(true);
  }, [handleSearchBarToggle, loadIndex]);

  const onInputBlur = useCallback(() => {
    setFocused(false);
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
  const isMac = isBrowser
    ? /mac/i.test(
        (navigator as any).userAgentData?.platform ?? navigator.platform
      )
    : false;

  useEffect(() => {
    if (!searchBarShortcut) {
      return;
    }
    // Add shortcuts command/ctrl + K
    const handleShortcut = (event: KeyboardEvent): void => {
      if (
        (isMac ? event.metaKey : event.ctrlKey) &&
        (event.key === "k" || event.key === "K")
      ) {
        event.preventDefault();
        searchBarRef.current?.focus();
        onInputFocus();
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [isMac, onInputFocus]);

  const onClearSearch = useCallback(() => {
    const params = new URLSearchParams(location.search);
    params.delete(SEARCH_PARAM_HIGHLIGHT);
    const paramsStr = params.toString();
    const searchUrl =
      location.pathname +
      (paramsStr != "" ? `?${paramsStr}` : "") +
      location.hash;
    if (searchUrl != location.pathname + location.search + location.hash) {
      history.push(searchUrl);
    }

    // We always clear these here because in case no match was selected the above history push wont happen
    setInputValue("");
    search.current?.autocomplete.setVal("");
  }, [location.pathname, location.search, location.hash, history]);

  return (
    <div
      className={clsx("navbar__search", styles.searchBarContainer, {
        [styles.searchIndexLoading]: loading && inputChanged,
        [styles.focused]: focused,
      })}
      hidden={hidden}
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
      {searchBarShortcut &&
        searchBarShortcutHint &&
        (inputValue !== "" ? (
          <button className={styles.searchClearButton} onClick={onClearSearch}>
            ✕
          </button>
        ) : (
          isBrowser && (
            <div className={styles.searchHintContainer}>
              <kbd className={styles.searchHint}>{isMac ? "⌘" : "ctrl"}</kbd>
              <kbd className={styles.searchHint}>K</kbd>
            </div>
          )
        ))}
    </div>
  );
}
