# @easyops-cn/docusaurus-search-local

[![Npm Version](https://img.shields.io/npm/v/@easyops-cn/docusaurus-search-local)](https://www.npmjs.com/package/@easyops-cn/docusaurus-search-local)
[![Build Status](https://travis-ci.com/easyops-cn/docusaurus-search-local.svg?branch=master)](https://travis-ci.com/easyops-cn/docusaurus-search-local)
[![Coverage Status](https://coveralls.io/repos/github/easyops-cn/docusaurus-search-local/badge.svg?branch=master)](https://coveralls.io/github/easyops-cn/docusaurus-search-local?branch=master)

An offline/local search plugin for [Docusaurus v2](https://v2.docusaurus.io/).

> Original forked from [cmfcmf/docusaurus-search-local](https://github.com/cmfcmf/docusaurus-search-local).
>
> Then later fully rewritten with TypeScript 💪, styles polished 💅, language of Chinese supported 🇨🇳, and tests covered ✅.

## Live demo

https://easyops-cn.github.io/docusaurus-search-example/

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

Add `@easyops-cn/docusaurus-search-local` into your docusaurus plugins.

````js
// In your `docusaurus.config.js`:
module.exports = {
  // ... Your other configurations.
  plugins: [
    // ... Your other plugins.
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
        // When applying `zh` in language, please install `nodejieba` in your project.
      },
    ],
  ],
};
````

> Notice!
>
> When applying `"zh"` in language, please also install `nodejieba` in your project, it became a peer dependency since v0.7.0.

```shell
npm install nodejieba
# or
yarn add nodejieba
```

## Plugin Options

| Name                         | Type               | Default   | Description                                                                                                                    |
| ---------------------------- | ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| indexDocs                    | boolean            | `true`    | Whether to index docs.                                                                                                         |
| indexBlog                    | boolean            | `true`    | Whether to index blog.                                                                                                         |
| indexPages                   | boolean            | `false`   | Whether to index pages.                                                                                                        |
| docsRouteBasePath            | string             | `"/docs"` | Base route path of docs. Slash at beginning is not required.                                                                   |
| blogRouteBasePath            | string             | `"/blog"` | Base route path of blog. Slash at beginning is not required.                                                                   |
| language                     | string \| string[] | `"en"`    | All [lunr-languages](https://github.com/MihaiValentin/lunr-languages) supported languages, + `zh` 🔥.                          |
| hashed                       | boolean            | `false`   | Whether to add a hashed query when fetching index (based on the content hash of all `*.md`)                                    |
| docsDir                      | string             | `"docs"`  | The dir of docs to get the content hash, it's relative to the dir of your project.                                             |
| blogDir                      | string             | `"blog"`  | Just like the `docsDir` but applied to blog.                                                                                   |
| removeDefaultStopWordFilter  | boolean            | `false`   | Sometimes people (E.g., us) want to keep the English stop words as indexed, since they maybe are relevant in programming docs. |
| searchResultLimits           | number             | `8`       | Limit the search results.                                                                                                      |
| searchResultContextMaxLength | number             | `50`      | Set the max length of characters of each search result to show. results.                                                       |

## Custom Styles

This plugin is shipped with polished styles just like the Algolia Search on the Docusaurus v2 website. Feel free to override these css custom properties (css variables) below.

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

## Contributing

See [contributing guide](CONTRIBUTING.md).
