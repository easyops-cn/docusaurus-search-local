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

```js
// In your `docusaurus.config.js`:
module.exports = {
  // ... Your other configurations.
  plugins: [
    // ... Your other plugins.
    require.resolve("@easyops-cn/docusaurus-search-local"),
  ],
};
```

## Contributing

See [contributing guide](CONTRIBUTING.md).
