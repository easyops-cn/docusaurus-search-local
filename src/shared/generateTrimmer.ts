import lunr from "lunr";

export function generateTrimmer(
  wordCharacters: string
): (token: lunr.Token) => lunr.Token {
  const startRegex = new RegExp("^[^" + wordCharacters + "]+", "u");
  const endRegex = new RegExp("[^" + wordCharacters + "]+$", "u");

  return function (token: lunr.Token) {
    return token.update(function (str: string) {
      return str.replace(startRegex, "").replace(endRegex, "");
    });
  };
}
