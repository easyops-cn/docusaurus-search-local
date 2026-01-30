export interface PluginOptions {
  /**
   * Whether to index docs.
   *
   * @default true
   */
  indexDocs?: boolean;

  /**
   * Whether to index blog.
   *
   * @default true
   */
  indexBlog?: boolean;

  /**
   * Whether to index pages.
   *
   * @default false
   */
  indexPages?: boolean;

  /**
   * Base route path(s) of docs. Slash at beginning is not required.
   *
   * Note: for [docs-only mode](https://docusaurus.io/docs/docs-introduction#docs-only-mode),
   * this needs to be the same as `routeBasePath` in your `@docusaurus/preset-classic` config e.g., `"/"`.
   *
   * @default "/docs"
   */
  docsRouteBasePath?: string | string[];

  /**
   * Base route path(s) of blog. Slash at beginning is not required.
   *
   * @default "/blog"
   */
  blogRouteBasePath?: string | string[];

  /**
   * All [lunr-languages](https://github.com/MihaiValentin/lunr-languages) supported languages, + `zh` 🔥.
   */
  language?: string | string[];

  /**
   * Whether to add a hashed query when fetching index (based on the content hash of all indexed
   * `*.md` in `docsDir` and `blogDir` if applicable). Setting to `"filename"` will save hash in
   * filename instead of query.
   *
   * @default false
   */
  hashed?: boolean | "query" | "filename";

  /**
   *  The dir(s) of docs to get the content hash, it's relative to the dir of your project.
   *
   * @default "docs"
   */
  docsDir?: string | string[];

  /**
   * The dir(s) of blog to get the content hash, it's relative to the dir of your project.
   *
   * @default "blog"
   */
  blogDir?: string | string[];

  /**
   * When you're using multi-instance of docs, set the docs plugin id which you'd like to
   * check the preferred version with, for the search index.
   */
  docsPluginIdForPreferredVersion?: string;

  /**
   * Sometimes people (E.g., us) want to keep the English stop words as indexed, since they
   * maybe are relevant in programming docs.
   *
   * Set a language list to remove their default stop word filter, `true` is equivalent to `["en"]`.
   */
  removeDefaultStopWordFilter?: boolean | string[];

  /**
   * Enable this if you want to be able to search for any partial word at the cost of search performance.
   *
   * @default false
   */
  removeDefaultStemmer?: boolean;

  /**
   * Highlight search terms on target page.
   *
   * @default false
   */
  highlightSearchTermsOnTargetPage?: boolean;

  /**
   * Limit the search results.
   *
   * @default 8
   */
  searchResultLimits?: number;

  /**
   * Set the max length of characters of each search result to show.
   *
   * @default 50
   */
  searchResultContextMaxLength?: number;

  /**
   * Whether an explicit path to a heading should be presented on a suggestion template.
   *
   * @default false
   */
  explicitSearchResultPath?: boolean;

  /**
   * Set the match rules to ignore some routes. Put a string if you want an exact match,
   * or put a regex if you want a partial match. Note: without the website base url.
   *
   * @default []
   */
  ignoreFiles?: string | RegExp | (string | RegExp)[];

  /**
   * A list of css selectors to ignore when indexing each page.
   *
   * @default []
   */
  ignoreCssSelectors?: string | string[];

  /**
   * Whether to enable keyboard shortcut to focus in search bar.
   *
   * @default true
   */
  searchBarShortcut?: boolean;

  /**
   * Whether to show keyboard shortcut hint in search bar. Disable it if you need to
   * hide the hint while shortcut is still enabled.
   *
   * @default true
   */
  searchBarShortcutHint?: boolean;

  /**
   * Custom keyboard shortcut to focus the search bar. Supports formats like:
   * - "s" for single key
   * - "ctrl+k" for key combinations
   * - "cmd+k" for Command+K (Mac) / Ctrl+K (others)
   * - "mod+k" for Command+K (Mac) / Ctrl+K (others) - recommended cross-platform option
   * - "ctrl+shift+k" for multiple modifiers
   *
   * @default "mod+k"
   */
  searchBarShortcutKeymap?: string;

  /**
   * The side of the navbar the search bar should appear on. By default,
   * it will try to autodetect based on your docusaurus config according
   * to [the docs](https://docusaurus.io/docs/api/themes/configuration#navbar-search).
   *
   * @default "auto"
   */
  searchBarPosition?: "auto" | "left" | "right";

  /**
   * Provide your custom dict for language of zh,
   * [see here](https://github.com/fxsjy/jieba#%E8%BD%BD%E5%85%A5%E8%AF%8D%E5%85%B8)
   */
  zhUserDict?: string;

  /**
   * Provide the file path to your custom dict for language of zh,
   * E.g.: `path.resolve("./src/zh-dict.txt")`
   */
  zhUserDictPath?: string;

  /**
   * Provide an list of sub-paths as separate search context, E.g.: `["docs", "community", "legacy/resources"]`.
   * It will create multiple search indexes by these paths.
   */
  searchContextByPaths?: (
    | string
    | { label: string | Record<string, string>; path: string }
  )[];

  /**
   * Whether to hide the search bar when no search context was matched.
   *
   * By default, if `searchContextByPaths` is set, pages which are not matched with it will be considered
   * as with a search context of ROOT. By setting `hideSearchBarWithNoSearchContext` to false, these pages
   * will be considered as with NO search context, and the search bar will be hidden.
   *
   * @default false
   */
  hideSearchBarWithNoSearchContext?: boolean;

  /**
   * Whether to show results from all the contexts if no context is provided.
   *
   * This option should not be used with `hideSearchBarWithNoSearchContext` set to `true` as this would show results
   * when there is no search context.
   *
   * @default false
   */
  useAllContextsWithNoSearchContext?: boolean;

  /**
   * Force enable search index even if noIndex: true is set, this also affects unlisted articles.
   *
   * @default false
   */
  forceIgnoreNoIndex?: boolean;

  /**
   * Set the edit distance for fuzzy matching during searches. Lower values will result in stricter matches,
   * while higher values will allow for more lenient matches. Set 0 to disable fuzzy matching.
   *
   * @default 1
   */
  fuzzyMatchingDistance?: number;

  /**
   * Synonyms configuration for search indexing and querying. Each array contains terms that should be 
   * treated as equivalent during both indexing and searching.
   * 
   * Example: [["CSS", "styles"], ["JS", "JavaScript"]]
   * A search for "CSS" will also match documents containing "styles" and vice versa.
   *
   * @default []
   */
  synonyms?: string[][];
}
