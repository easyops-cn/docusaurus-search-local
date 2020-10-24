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

There is the [Release Please](https://github.com/apps/release-please) bot to handle publishing. Just merge the relevant release-PR, no worries.

<details>

Alternatively, publish manually:

```shell
yarn release
git push --follow-tags --atomic
yarn build && npm publish
```

</details>
