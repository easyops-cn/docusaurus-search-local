# Contributing guide

## Development

```shell
yarn
yarn start
```

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
