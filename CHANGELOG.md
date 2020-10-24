# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.9.0](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.8.0...v0.9.0) (2020-10-23)


### Features

* add a plugin option `searchResultLimits` ([0bdec39](https://www.github.com/easyops-cn/docusaurus-search-local/commit/0bdec39951a78d86d31e9885fd9e91ffad25a5f4))
* add a plugin option of `searchResultContextMaxLength` ([3313552](https://www.github.com/easyops-cn/docusaurus-search-local/commit/33135529c277431db78ed374eb83de23667ecc38))
* validate options using Joi ([0b1361a](https://www.github.com/easyops-cn/docusaurus-search-local/commit/0b1361a5d7e3ca9c5dd35fc89d64098c8670e7d1))

## [0.8.0](https://github.com/easyops-cn/docusaurus-search-local/compare/v0.6.0...v0.8.0) (2020-10-21)

### ⚠ BREAKING CHANGES

- renamed `docsBasePath` and `blogBasePath` to `docsRouteBasePath` and `blogRouteBasePath`, to keep them the same as cmfcmf/docusaurus-search-local.
- users need to install `nodejieba` if using language of zh.

### Features

- make nodejieba as a peer dependency ([956b3b5](https://github.com/easyops-cn/docusaurus-search-local/commit/956b3b563c8662c8d8cb867ef174548221865754))
- rename option of \*BasePath ([978846a](https://github.com/easyops-cn/docusaurus-search-local/commit/978846a13c303c321b154eca8847e2eab33baa5b))

### Bug Fixes

- fix nodejieba is still required ([78e4d67](https://github.com/easyops-cn/docusaurus-search-local/commit/78e4d677a5bccb0ae3aff0fc16c43ac031b911a3))
- fix styles on mobile screen ([1cc6850](https://github.com/easyops-cn/docusaurus-search-local/commit/1cc6850402cd7eced043736d4b826f97bd2498f0))
- languages of non-en require stemmer support ([bc8e451](https://github.com/easyops-cn/docusaurus-search-local/commit/bc8e451cfd65024d48f08c481f2cd4850c2d0dbd))

### [0.7.1](https://github.com/easyops-cn/docusaurus-search-local/compare/v0.7.0...v0.7.1) (2020-10-21)

### Bug Fixes

- fix nodejieba is still required ([78e4d67](https://github.com/easyops-cn/docusaurus-search-local/commit/78e4d677a5bccb0ae3aff0fc16c43ac031b911a3))

## [0.7.0](https://github.com/easyops-cn/docusaurus-search-local/compare/v0.6.2...v0.7.0) (2020-10-21)

### ⚠ BREAKING CHANGES

- users need to install `nodejieba` if using language of zh.

### Features

- make nodejieba as a peer dependency ([956b3b5](https://github.com/easyops-cn/docusaurus-search-local/commit/956b3b563c8662c8d8cb867ef174548221865754))

### [0.6.2](https://github.com/easyops-cn/docusaurus-search-local/compare/v0.6.1...v0.6.2) (2020-10-21)

### Bug Fixes

- fix styles on mobile screen ([1cc6850](https://github.com/easyops-cn/docusaurus-search-local/commit/1cc6850402cd7eced043736d4b826f97bd2498f0))

### [0.6.1](https://github.com/easyops-cn/docusaurus-search-local/compare/v0.6.0...v0.6.1) (2020-10-21)

### Bug Fixes

- languages of non-en require stemmer support ([bc8e451](https://github.com/easyops-cn/docusaurus-search-local/commit/bc8e451cfd65024d48f08c481f2cd4850c2d0dbd))

## [0.6.0](https://github.com/easyops-cn/docusaurus-search-local/compare/v0.5.2...v0.6.0) (2020-10-20)

### ⚠ BREAKING CHANGES

- css already included.

### Features

- plugin options refined ([b722878](https://github.com/easyops-cn/docusaurus-search-local/commit/b72287896d8e40477936d0d993a14760220c7e46))
- shipped with css ([af0d7b0](https://github.com/easyops-cn/docusaurus-search-local/commit/af0d7b03579d48842625eeaf81dcfc4d22d7c3a6))

### [0.5.3](https://github.com/easyops-cn/docusaurus-search-local/compare/v0.5.2...v0.5.3) (2020-10-20)

### Features

- plugin options refined ([b722878](https://github.com/easyops-cn/docusaurus-search-local/commit/b72287896d8e40477936d0d993a14760220c7e46))

### [0.5.2](https://github.com/easyops-cn/docusaurus-search-local/compare/v0.5.1...v0.5.2) (2020-10-18)

### Bug Fixes

- fix consecutive Chinese words are not matched ([db8541e](https://github.com/easyops-cn/docusaurus-search-local/commit/db8541e6598e2e99b230374b403622f8d3b8a9d3))

### 0.5.1 (2020-10-18)
