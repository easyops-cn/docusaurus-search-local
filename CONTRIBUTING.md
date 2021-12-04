# Contributing guide

## Development

```shell
yarn
yarn start
```

Note: if you are editing `src/client/theme/**/*.css`, you should run `yarn postbuild` each time you edited these files.

## Testing

```shell
yarn test
```

## Publishing

There is the [Release Please Action](https://github.com/google-github-actions/release-please-action) bot to handle publishing. Just merge the relevant release-PR, no worries.

<details>

Alternatively, publish manually:

```shell
yarn release
git push --follow-tags --atomic
yarn build && npm publish
```

</details>
