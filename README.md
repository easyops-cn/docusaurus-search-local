# @easyops-cn/docusaurus-search-local

[![Npm Version](https://img.shields.io/npm/v/@easyops-cn/docusaurus-search-local)](https://www.npmjs.com/package/@easyops-cn/docusaurus-search-local)
[![CI Status](https://github.com/easyops-cn/docusaurus-search-local/workflows/gh-pages/badge.svg?event=push&branch=master)](https://github.com/easyops-cn/docusaurus-search-local/actions?query=workflow%3Agh-pages)
[![Coverage Status](https://coveralls.io/repos/github/easyops-cn/docusaurus-search-local/badge.svg?branch=master)](https://coveralls.io/github/easyops-cn/docusaurus-search-local?branch=master)

An offline/local search plugin/theme for [Docusaurus v2/v3](https://docusaurus.io/), which supports multiple languages, especially optimized for language of zh.

> Originally forked from [cmfcmf/docusaurus-search-local](https://github.com/cmfcmf/docusaurus-search-local).
>
> Then later fully rewritten with TypeScript 💪, styles polished 💅, language of Chinese supported 🇨🇳, and tests covered ✅.

- [Live Demo](#live-demo)
- [Screen Shots](#screen-shots)
- [Installation](#installation)
- [Usage](#usage)
- [Theme Options](#theme-options)
- [Custom Styles](#custom-styles)
- [Trouble Shooting](#trouble-shooting)
- [Further Reading](#further-reading)
- [Contributing](#contributing)

## Live Demo

https://easyops-cn.github.io/docusaurus-search-local/

## Screen Shots

![Screen Shot EN](screen-shots/screen-shot-en.png)

![Screen Shot ZH](screen-shots/screen-shot-zh.png)

## Installation

```shell
npm install --save @easyops-cn/docusaurus-search-local
# or
yarn add @easyops-cn/docusaurus-search-local
```

## Usage

Add `@easyops-cn/docusaurus-search-local` into your docusaurus themes.

````js
// In your `docusaurus.config.js`:
module.exports = {
  // ... Your other configurations.
  themes: [
    // ... Your other themes.
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
      }),
    ],
  ],
};
````

> Notice: We present this as a theme instead of plugin now, see [this comment](https://github.com/facebook/docusaurus/issues/6488#issuecomment-1024124096).

## Theme Options

| Name                              | Type                                              | Default   | Description                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------- | ------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| indexDocs                         | boolean                                           | `true`    | Whether to index docs.                                                                                                                                                                                                                                                                                                                                         |
| indexBlog                         | boolean                                           | `true`    | Whether to index blog.                                                                                                                                                                                                                                                                                                                                         |
| indexPages                        | boolean                                           | `false`   | Whether to index pages.                                                                                                                                                                                                                                                                                                                                        |
| docsRouteBasePath                 | string \| string[]                                | `"/docs"` | Base route path(s) of docs. Slash at beginning is not required. Note: for [docs-only mode](https://docusaurus.io/docs/docs-introduction#docs-only-mode), this needs to be the same as `routeBasePath` in your `@docusaurus/preset-classic` config e.g., `"/"`.                                                                                                 |
| blogRouteBasePath                 | string \| string[]                                | `"/blog"` | Base route path(s) of blog. Slash at beginning is not required.                                                                                                                                                                                                                                                                                                |
| language                          | string \| string[]                                | `"en"`    | All [lunr-languages](https://github.com/MihaiValentin/lunr-languages) supported languages, + `zh` 🔥.                                                                                                                                                                                                                                                          |
| hashed                            | boolean \| `"filename"` \| `"query"`              | `false`   | Whether to add a hashed query when fetching index (based on the content hash of all indexed `*.md` in `docsDir` and `blogDir` if applicable). Setting to `"filename"` will save hash in filename instead of query.                                                                                                                                             |
| docsDir                           | string \| string[]                                | `"docs"`  | The dir(s) of docs to get the content hash, it's relative to the dir of your project.                                                                                                                                                                                                                                                                          |
| blogDir                           | string \| string[]                                | `"blog"`  | Just like the `docsDir` but applied to blog.                                                                                                                                                                                                                                                                                                                   |
| removeDefaultStopWordFilter       | boolean                                           | `false`   | Sometimes people (E.g., us) want to keep the English stop words as indexed, since they maybe are relevant in programming docs.                                                                                                                                                                                                                                 |
| removeDefaultStemmer              | boolean                                           | `false`   | Enable this if you want to be able to search for any partial word at the cost of search performance.                                                                                                                                                                                                                                                           |
| highlightSearchTermsOnTargetPage  | boolean                                           | `false`   | Highlight search terms on target page.                                                                                                                                                                                                                                                                                                                         |
| searchResultLimits                | number                                            | `8`       | Limit the search results.                                                                                                                                                                                                                                                                                                                                      |
| searchResultContextMaxLength      | number                                            | `50`      | Set the max length of characters of each search result to show.                                                                                                                                                                                                                                                                                                |
| explicitSearchResultPath          | boolean                                           | `false`   | Whether an explicit path to a heading should be presented on a suggestion template.                                                                                                                                                                                                                                                                            |
| ignoreFiles                       | string \| RegExp \| (string \| RegExp)[]          | `[]`      | Set the match rules to ignore some routes. Put a string if you want an exact match, or put a regex if you want a partial match. Note: without the website base url.                                                                                                                                                                                            |
| ignoreCssSelectors                | string \| string[]                                | `[]`      | A list of css selectors to ignore when indexing each page.                                                                                                                                                                                                                                                                                                     |
| searchBarShortcut                 | boolean                                           | `true`    | Whether to enable keyboard shortcut to focus in search bar.                                                                                                                                                                                                                                                                                                    |
| searchBarShortcutHint             | boolean                                           | `true`    | Whether to show keyboard shortcut hint in search bar. Disable it if you need to hide the hint while shortcut is still enabled.                                                                                                                                                                                                                                 |
| searchBarPosition                 | `"auto"` \| `"left"` \| `"right"`                 | `"auto"`  | The side of the navbar the search bar should appear on. By default, it will try to autodetect based on your docusaurus config according to [the docs](https://docusaurus.io/docs/api/themes/configuration#navbar-search).                                                                                                                                      |
| docsPluginIdForPreferredVersion   | string                                            |           | When you're using multi-instance of docs, set the docs plugin id which you'd like to check the preferred version with, for the search index.                                                                                                                                                                                                                   |
| zhUserDict                        | string                                            |           | Provide your custom dict for language of zh, [see here](https://github.com/fxsjy/jieba#%E8%BD%BD%E5%85%A5%E8%AF%8D%E5%85%B8)                                                                                                                                                                                                                                   |
| zhUserDictPath                    | string                                            |           | Provide the file path to your custom dict for language of zh, E.g.: `path.resolve("./src/zh-dict.txt")`                                                                                                                                                                                                                                                        |
| searchContextByPaths              | `(string \| { label: string; path: string; } )[]` | `[]`      | Provide an list of sub-paths as separate search context, E.g.: `["docs", "community", "legacy/resources"]`. It will create multiple search indexes by these paths.                                                                                                                                                                                             |
| hideSearchBarWithNoSearchContext  | boolean                                           | `false`   | Whether to hide the search bar when no search context was matched. By default, if `searchContextByPaths` is set, pages which are not matched with it will be considered as with a search context of ROOT. By setting `hideSearchBarWithNoSearchContext` to false, these pages will be considered as with NO search context, and the search bar will be hidden. |
| useAllContextsWithNoSearchContext | boolean                                           | `false`   | Whether to show results from all the contexts if no context is provided. This option should not be used with `hideSearchBarWithNoSearchContext` set to `true` as this would show results when there is no search context. This will duplicate indexes and might have a performance cost depending on the index sizes.                                          |

### I18N

Since v0.25.0, we support [docusaurus i18n system](<(https://docusaurus.io/docs/i18n/introduction)>), and provided `en` and `zh-CN` translations out of the box.

For other languages, please follow the official tutorial about how to [translate plugin data](https://docusaurus.io/docs/i18n/tutorial#translate-plugin-data). And translate `theme.SearchBar.*` and `theme.SearchPage.*` in `i18n/*/code.json`.

Translations by options is dropped since v0.25.0.

<details>
<summary>See translation options for &lt;0.25.0</summary>
To make this theme localized, pass a `translations` option which defaults to:

```json
{
  "translations": {
    "search_placeholder": "Search",
    "see_all_results": "See all results",
    "no_results": "No results.",
    "search_results_for": "Search results for \"{{ keyword }}\"",
    "search_the_documentation": "Search the documentation",
    "count_documents_found": "{{ count }} document found",
    "count_documents_found_plural": "{{ count }} documents found",
    "no_documents_were_found": "No documents were found"
  }
}
```

Note that `*_plural` can be omitted if it is the same as singular.

</details>

## Custom Styles

This theme is shipped with polished styles just like the Algolia Search on the Docusaurus v2 website. Feel free to override these css custom properties (css variables) below.

| Var                              | Default (light)                                                        | Default (dark)                                          |
| -------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| --search-local-modal-background  | `#f5f6f7`                                                              | `var(--ifm-background-color)`                           |
| --search-local-modal-shadow      | `inset 1px 1px 0 0 hsla(0, 0%, 100%, 0.5),`<br />`0 3px 8px 0 #555a64` | `inset 1px 1px 0 0 #2c2e40,`<br />`0 3px 8px 0 #000309` |
| --search-local-modal-width       | `560px`                                                                | -                                                       |
| --search-local-modal-width-sm    | `340px`                                                                | -                                                       |
| --search-local-spacing           | `12px`                                                                 | -                                                       |
| --search-local-hit-background    | `#fff`                                                                 | `var(--ifm-color-emphasis-100)`                         |
| --search-local-hit-shadow        | `0 1px 3px 0 #d4d9e1`                                                  | `none`                                                  |
| --search-local-hit-color         | `#444950`                                                              | `var(--ifm-font-color-base)`                            |
| --search-local-hit-height        | `56px`                                                                 | -                                                       |
| --search-local-highlight-color   | `var(--ifm-color-primary)`                                             | -                                                       |
| --search-local-muted-color       | `#969faf`                                                              | `var(--ifm-color-secondary-darkest)`                    |
| --search-local-icon-stroke-width | `1.4`                                                                  | -                                                       |
| --search-local-hit-active-color  | `var(--ifm-color-white)`                                               | -                                                       |

E.g.:

```css
:root {
  --search-local-modal-width: 480px;
  --search-local-highlight-color: #5468ff;
}

html[data-theme="dark"] {
  --search-local-highlight-color: #d23669;
}
```

## Trouble Shooting

When building your docs project, Set the env `DEBUG=search-local:*` to enable [debug](https://github.com/visionmedia/debug) logs.

```shell
# In your docs project:
DEBUG=search-local:* yarn build
```

In case some specific errors occurred:

- `Error: Cannot mix different versions of joi schemas`:

  - Try using @easyops-cn/docusaurus-search-local >= v0.16.0 with Docusaurus >= v2.0.0-alpha.73
  - Try using @easyops-cn/docusaurus-search-local between v0.14.0 and v0.15.1 with Docusaurus between v2.0.0-alpha.68 and v2.0.0-alpha.72
  - Or try using @easyops-cn/docusaurus-search-local <= v0.13.1 with Docusaurus <= v2.0.0-alpha.66

- `Module not found: Error: Can't resolve '@docusaurus/useRouteContext'`:
  - Try using @easyops-cn/docusaurus-search-local >= v0.25.0 with Docusaurus >= v2.0.0-beta.18
  - Try using @easyops-cn/docusaurus-search-local < v0.25.0 with Docusaurus < v2.0.0-beta.18

## Further Reading

- [多语言全文搜索](https://wangshenwei.com/multilingual-full-text-search/)

## Contributing

See [contributing guide](CONTRIBUTING.md).
