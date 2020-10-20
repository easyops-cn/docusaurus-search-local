# Contributing guide

## Development

```shell
yarn
yarn build
```

## Testing

```shell
yarn test
```

## Publishing

```shell
yarn release
git push --follow-tags --atomic
yarn build && npm publish
```
