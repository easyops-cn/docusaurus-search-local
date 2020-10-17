import * as lunr from "lunr";
import nodejieba from "nodejieba";
import { MatchMetadata } from "../shared/interfaces";

// https://zhuanlan.zhihu.com/p/33335629
const singleMatchOfWord = /\w+|\p{Unified_Ideograph}/u;

nodejieba.load();

const splitRegExp = [/(_)([^_])/g, /([^_])(_)/g];

function cutByUnderscore(input: string) {
  return splitRegExp
    .reduce((carry, re) => carry.replace(re, "$1\0$2"), input)
    .split("\0");
}

export function tokenizer(
  obj: string | string[],
  metadata: MatchMetadata
): lunr.Token[] {
  if (obj == null || obj == undefined) {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj.map(function (t) {
      return new lunr.Token(
        lunr.utils.asString(t).toLowerCase(),
        (lunr.utils as any).clone(metadata)
      );
    });
  }
  const content = obj.toString().toLowerCase();
  const tokens: lunr.Token[] = [];
  let start = 0;
  let text = content;
  while (text.length > 0) {
    const match = text.match(singleMatchOfWord);
    if (!match) {
      break;
    }
    const word = match[0];
    start += match.index as number;
    if (/\w/.test(word[0])) {
      tokens.push(
        new lunr.Token(word, {
          ...(lunr.utils as any).clone(metadata),
          position: [start, word.length],
          index: tokens.length,
        })
      );

      // Try to cut `api_gateway` to `api` and `gateway`.
      const subWords = cutByUnderscore(word);
      if (subWords.length > 1) {
        let i = 0;
        for (const subWord of subWords) {
          if (subWord[0] !== "_") {
            tokens.push(
              new lunr.Token(subWord, {
                ...(lunr.utils as any).clone(metadata),
                position: [start + i, subWord.length],
                index: tokens.length,
              })
            );
          }
          i += subWord.length;
        }
      }

      start += word.length;
    } else {
      for (const zhWord of nodejieba.cut(word)) {
        tokens.push(
          new lunr.Token(zhWord, {
            ...(lunr.utils as any).clone(metadata),
            position: [start, zhWord.length],
            index: tokens.length,
          })
        );
        start += zhWord.length;
      }
    }
    text = content.substring(start);
  }
  return tokens;
}
