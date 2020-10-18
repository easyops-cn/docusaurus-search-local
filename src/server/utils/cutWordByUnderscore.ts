const splitRegExp = [/(_)([^_])/g, /([^_])(_)/g];

export function cutWordByUnderscore(input: string): string[] {
  return splitRegExp
    .reduce((carry, re) => carry.replace(re, "$1\0$2"), input)
    .split("\0");
}
