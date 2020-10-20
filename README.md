# @easyops-cn/docusaurus-search-local

[![Build Status](https://travis-ci.com/easyops-cn/docusaurus-search-local.svg?branch=master)](https://travis-ci.com/easyops-cn/docusaurus-search-local)
[![Coverage Status](https://coveralls.io/repos/github/easyops-cn/docusaurus-search-local/badge.svg?branch=master)](https://coveralls.io/github/easyops-cn/docusaurus-search-local?branch=master)

> Original forked from [cmfcmf/docusaurus-search-local](https://github.com/cmfcmf/docusaurus-search-local).
>
> Then later fully rewritten with TypeScript, styles polished, language of Chinese supported, and tests covered.

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
      },
    ],
  ],
};
````

## Plugin Options

| Name                        | Type               | Default   | Description                                                                                                                    |
| --------------------------- | ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| indexDocs                   | boolean            | `true`    | Whether to index docs.                                                                                                         |
| indexBlog                   | boolean            | `true`    | Whether to index blog.                                                                                                         |
| indexPages                  | boolean            | `false`   | Whether to index pages.                                                                                                        |
| docsBasePath                | string             | `"/docs"` | Base route path of docs. Slash at beginning is not required.                                                                   |
| blogBasePath                | string             | `"/blog"` | Base route path of blog. Slash at beginning is not required.                                                                   |
| language                    | string \| string[] | `"en"`    | All [lunr-languages](https://github.com/MihaiValentin/lunr-languages) supported languages, + `zh` 🔥.                          |
| hashed                      | boolean            | `false`   | Whether to add a hashed query when fetching index (based on the content hash of all `*.md`)                                    |
| docsDir                     | string             | -         | The dir of docs to get the content hash, it's relative to the siteDir of Docusaurus, defaults to `docsBasePath`.               |
| blogDir                     | string             | -         | Just like the `docsDir` but applied to blog.                                                                                   |
| removeDefaultStopWordFilter | boolean            | `false`   | Sometimes people (E.g., us) want to keep the English stop words as indexed, since they maybe are relevant in programming docs. |

## Contributing

See [contributing guide](CONTRIBUTING.md).
