# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.13.0](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.12.0...v0.13.0) (2020-11-14)


### Features

* add an opt-in option `highlightSearchTermsOnTargetPage` ([e6621e8](https://www.github.com/easyops-cn/docusaurus-search-local/commit/e6621e87007cb97b12deb4ed8d8264f52dee8791))

## [0.12.0](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.11.2...v0.12.0) (2020-11-14)


### Features

* support multiple docs and blog folders [#24](https://www.github.com/easyops-cn/docusaurus-search-local/issues/24) ([d90f4ad](https://www.github.com/easyops-cn/docusaurus-search-local/commit/d90f4ad707bd0924e027c7484e6f246d4df9423a))

### [0.11.2](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.11.1...v0.11.2) (2020-11-05)


### Bug Fixes

* fix errors in development mode ([2331b73](https://www.github.com/easyops-cn/docusaurus-search-local/commit/2331b7322a32d351634667fcdd20fb4b62e80b61))
* show tips in search page in development mode ([4666bee](https://www.github.com/easyops-cn/docusaurus-search-local/commit/4666bee02c68c6b24844369e717c31f19c23dfda))

### [0.11.1](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.11.0...v0.11.1) (2020-11-02)


### Bug Fixes

* remove debug flag ([7238af2](https://www.github.com/easyops-cn/docusaurus-search-local/commit/7238af2fa9063327e338acdb2420505435c07308))

## [0.11.0](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.10.1...v0.11.0) (2020-11-01)


### Features

* search page to view all results ([0495e71](https://www.github.com/easyops-cn/docusaurus-search-local/commit/0495e7192478606c0d499f768a8beedc0e8a7225))

### [0.10.1](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.10.0...v0.10.1) (2020-10-30)


### Bug Fixes

* process stop words for search keyword ([df3d789](https://www.github.com/easyops-cn/docusaurus-search-local/commit/df3d789a09b98ebe20f43c51619e8fa780a85e7f))

## [0.10.0](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.9.4...v0.10.0) (2020-10-29)


### Features

* show loading status ([853603a](https://www.github.com/easyops-cn/docusaurus-search-local/commit/853603afc6a109116f49d621953c7220d89a6d05))

### [0.9.4](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.9.3...v0.9.4) (2020-10-29)


### Bug Fixes

* refine index hash ([7551266](https://www.github.com/easyops-cn/docusaurus-search-local/commit/75512665713733199f85b51530c017ac86f24885))

### [0.9.3](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.9.2...v0.9.3) (2020-10-29)


### Bug Fixes

* fix languages other than en and zh ([f43fd4b](https://www.github.com/easyops-cn/docusaurus-search-local/commit/f43fd4b6a261338da70556396a9c810884674e17)), closes [#9](https://www.github.com/easyops-cn/docusaurus-search-local/issues/9)

### [0.9.2](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.9.1...v0.9.2) (2020-10-24)


### Bug Fixes

* refine debug ([554c451](https://www.github.com/easyops-cn/docusaurus-search-local/commit/554c451d04f3d6b1f2fa2f4732507d5e75655de7))

### [0.9.1](https://www.github.com/easyops-cn/docusaurus-search-local/compare/v0.9.0...v0.9.1) (2020-10-24)


### Bug Fixes

* check dir before create content hash ([faf9cf7](https://www.github.com/easyops-cn/docusaurus-search-local/commit/faf9cf7e338a0fbc6de06a42a8cf4148c0ff0bab))

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
