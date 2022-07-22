// https://zhuanlan.zhihu.com/p/33335629
const singleMatchOfWord = /\w+|\p{Unified_Ideograph}/u;

export function looseTokenize(content: string): string[] {
  const tokens: string[] = [];
  let start = 0;
  let text = content;
  while (text.length > 0) {
    const match = text.match(singleMatchOfWord);
    if (!match) {
      tokens.push(text);
      break;
    }
    if ((match.index as number) > 0) {
      tokens.push(text.substring(0, match.index));
    }
    tokens.push(match[0]);
    start += (match.index as number) + match[0].length;
    text = content.substring(start);
  }
  return tokens;
}
