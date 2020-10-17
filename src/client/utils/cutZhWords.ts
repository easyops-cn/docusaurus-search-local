import { SmartTerm } from "../../shared/interfaces";

/**
 * Get all possible terms for a string of consecutive Chinese words,
 * by a words dictionary.
 *
 * @remarks
 *
 * Terms are sorted in ascending order by the count of words.
 *
 * @param token - A string of consecutive Chinese words.
 * @param zhDictionary - A Chinese words dictionary.
 *
 * @returns A smart term list.
 */
export function cutZhWords(token: string, zhDictionary: string[]): SmartTerm[] {
  const wrappedTerms: WrappedTerm[] = [];
  function cut(subToken: string, carry: WrappedTerm): void {
    let matchedLastIndex = 0;
    let matched = false;
    for (const words of zhDictionary) {
      if (subToken.substr(0, words.length) === words) {
        const nextCarry = {
          missed: carry.missed,
          term: carry.term.concat(words),
        };
        if (subToken.length > words.length) {
          cut(subToken.substr(words.length), nextCarry);
        } else {
          wrappedTerms.push(nextCarry);
        }
        matched = true;
      } else {
        for (
          let lastIndex = words.length - 1;
          lastIndex > matchedLastIndex;
          lastIndex -= 1
        ) {
          const subWords = words.substr(0, lastIndex);
          if (subToken.substr(0, lastIndex) === subWords) {
            matchedLastIndex = lastIndex;
            const nextCarry = {
              missed: carry.missed,
              term: carry.term.concat(`${subWords}*`),
            };
            if (subToken.length > lastIndex) {
              cut(subToken.substr(lastIndex), nextCarry);
            } else {
              wrappedTerms.push(nextCarry);
            }
            matched = true;
            break;
          }
        }
      }
    }
    if (!matched) {
      if (subToken.length > 0) {
        cut(subToken.substr(1), {
          missed: carry.missed + 1,
          term: carry.term,
        });
      } else if (carry.term.length > 0) {
        wrappedTerms.push(carry);
      }
    }
  }
  cut(token, {
    missed: 0,
    term: [],
  });
  return wrappedTerms
    .sort((a, b) => {
      const aMissed = a.missed > 0 ? 1 : 0;
      const bMissed = b.missed > 0 ? 1 : 0;
      if (aMissed !== bMissed) {
        // Put all no-words-missed terms before words-missed terms.
        return aMissed - bMissed;
      }
      // Put terms with less words before those with more words.
      return a.term.length - b.term.length;
    })
    .map((item) => item.term);
}

interface WrappedTerm {
  missed: number;
  term: SmartTerm;
}
