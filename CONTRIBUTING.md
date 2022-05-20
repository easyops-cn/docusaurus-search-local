# Contributing guide

🚨 Note: we use yarn [Plug'n'Play](https://yarnpkg.com/features/pnp) and [workspaces](https://yarnpkg.com/features/workspaces) now.

## Development

Before getting started for development, you may need to [setup your IDE](https://yarnpkg.com/getting-started/editor-sdks) for proper type hints since we're using Plug'n'Play installs.

```shell
yarn
yarn start
```

Note: if you are editing `docusaurus/src/client/theme/**/*.css` or `docusaurus/src/locales/*.json`, you should run `yarn workspace @easyops-cn/docusaurus-search-local run copy-static-files` each time you edited these files.

The `yarn start` command will watch and run both this theme itself and the example website parallelly. However, the search index is only available when you run build against the website!

So if your feature requires the search index, you should:

```shell
# Open a terminal to watch and run the theme.
yarn start:theme
```

```shell
# Open another terminal to build the website.
yarn build:website
```

## Testing

Note: Please use Node >=16.15.0, or there maybe an issue that running test will be hanging.

```shell
yarn test
```

## Publishing

There is the [Release Please Action](https://github.com/google-github-actions/release-please-action) bot to handle publishing. Just merge the relevant release-PR, no worries.
