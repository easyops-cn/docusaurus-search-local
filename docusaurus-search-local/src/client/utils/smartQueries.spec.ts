import lunr from "lunr";
import { smartQueries } from "./smartQueries";
import {
  __setLanguage,
  __setRemoveDefaultStopWordFilter,
  __setFuzzyMatchingDistance,
  __setSynonyms,
} from "./proxiedGeneratedConstants";
import { SmartQuery } from "../../shared/interfaces";

jest.mock("./proxiedGeneratedConstants");

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("lunr-languages/lunr.stemmer.support")(lunr);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("../../shared/lunrLanguageZh").lunrLanguageZh(lunr);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("lunr-languages/lunr.multi")(lunr);

(lunr as any).fake = {};

const zhDictionary = ["研究生", "研究", "生命", "科学", "生命科学"];

interface TestQuery {
  tokens: string[];
  keyword: string;
}

describe("smartQueries", () => {
  beforeEach(() => {
    __setLanguage(["en", "zh"]);
    __setRemoveDefaultStopWordFilter([]);
  });

  test.each<[string[], TestQuery[]]>([
    [
      ["hello"],
      [
        {
          tokens: ["hello"],
          keyword: "+hello",
        },
        {
          tokens: ["hello"],
          keyword: "+hello*",
        },
      ],
    ],
    [
      ["hello", "world"],
      [
        {
          tokens: ["hello", "world"],
          keyword: "+hello +world",
        },
        {
          tokens: ["hello", "world"],
          keyword: "+hello +world*",
        },
      ],
    ],
    [
      ["研究生命科学"],
      [
        {
          tokens: ["研究", "生命科学"],
          keyword: "+研究 +生命科学",
        },
        {
          tokens: ["研究", "生命", "科学"],
          keyword: "+研究 +生命 +科学",
        },
        {
          tokens: ["研究生", "科学"],
          keyword: "+研究生 +科学",
        },
        {
          tokens: ["研究", "生命科学"],
          keyword: "+研究 +生命科学*",
        },
        {
          tokens: ["研究", "生命", "科学"],
          keyword: "+研究 +生命 +科学*",
        },
        {
          tokens: ["研究生", "科学"],
          keyword: "+研究生 +科学*",
        },
        {
          tokens: ["研究", "生命"],
          keyword: "+研究 +生命",
        },
        {
          tokens: ["研究", "科学"],
          keyword: "+研究 +科学",
        },
        {
          tokens: ["生命", "科学"],
          keyword: "+生命 +科学",
        },
        {
          tokens: ["研究", "科学"],
          keyword: "+研究 +科学*",
        },
        {
          tokens: ["生命", "科学"],
          keyword: "+生命 +科学*",
        },
      ],
    ],
    [
      ["研究生"],
      [
        {
          tokens: ["研究生"],
          keyword: "+研究生",
        },
        {
          tokens: ["研究", "生"],
          keyword: "+研究 +生*",
        },
        {
          tokens: ["研究生"],
          keyword: "+研究生*",
        },
      ],
    ],
    /* [
      ["生命科学", "研究生"],
      [
        {
          tokens: ["生命科学", "研究生"],
          keyword: "+生命科学 +研究生",
        },
        {
          tokens: ["生命科学", "研究", "生"],
          keyword: "+生命科学 +研究 +生*",
        },
        {
          tokens: ["生命", "科学", "研究生"],
          keyword: "+生命 +科学 +研究生",
        },
        {
          tokens: ["生命", "科学", "研究", "生"],
          keyword: "+生命 +科学 +研究 +生*",
        },
        {
          tokens: ["生命科学", "研究生"],
          keyword: "+生命科学 +研究生*",
        },
        {
          tokens: ["生命", "科学", "研究生"],
          keyword: "+生命 +科学 +研究生*",
        },
      ],
    ], */
    [
      ["a", "hello", "world"],
      [
        {
          tokens: ["a", "hello", "world"],
          keyword: "+a +hello +world",
        },
        {
          tokens: ["hello", "world"],
          keyword: "+hello +world",
        },
        {
          tokens: ["a", "hello", "world"],
          keyword: "+a +hello +world*",
        },
        {
          tokens: ["hello", "world"],
          keyword: "+hello +world*",
        },
      ],
    ],
    [
      ["hello", "a"],
      [
        {
          tokens: ["hello", "a"],
          keyword: "+hello +a",
        },
        {
          tokens: ["hello"],
          keyword: "+hello",
        },
        {
          tokens: ["hello", "a"],
          keyword: "+hello +a*",
        },
      ],
    ],
    [
      ["a"],
      [
        {
          tokens: ["a"],
          keyword: "+a",
        },
        {
          tokens: ["a"],
          keyword: "+a*",
        },
      ],
    ],
    [
      ["hello", "world", "命"],
      [
        {
          tokens: ["hello", "world", "命"],
          keyword: "+*hello* +*world* +*命*",
        },
      ],
    ],
    [
      ["termos", "alfabetização"],
      [
        {
          tokens: ["termos", "alfabetização"],
          keyword: "+termos +alfabetização",
        },
        {
          tokens: ["termos", "alfabetização"],
          keyword: "+termos +alfabetização*",
        },
      ],
    ],
  ])("smartQueries(%j, zhDictionary) should work", (tokens, queries) => {
    expect(smartQueries(tokens, zhDictionary).map(transformQuery)).toEqual(
      queries
    );
  });
});

describe("smartQueries with no stop words filter", () => {
  beforeEach(() => {
    __setLanguage(["en", "fake"]);
    __setRemoveDefaultStopWordFilter(["en"]);
  });

  test.each<[string[], TestQuery[]]>([
    [
      ["a", "hello"],
      [
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello",
        },
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello*",
        },
      ],
    ],
  ])("smartQueries(%j, zhDictionary) should work", (tokens, queries) => {
    expect(smartQueries(tokens, zhDictionary).map(transformQuery)).toEqual(
      queries
    );
  });
});

describe("smartQueries with fuzzy matching distance 1", () => {
  beforeEach(() => {
    __setFuzzyMatchingDistance(1);
  });

  test.each<[string[], TestQuery[]]>([
    [
      ["a", "hello"],
      [
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello",
        },
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello*",
        },
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello~1",
        },
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello*~1",
        },
      ],
    ],
    [
      ["a", "b"],
      [
        {
          tokens: ["a", "b"],
          keyword: "+a +b",
        },
        {
          tokens: ["a", "b"],
          keyword: "+a +b*",
        },
      ],
    ],
  ])("smartQueries(%j, zhDictionary) should work", (tokens, queries) => {
    expect(smartQueries(tokens, zhDictionary).map(transformQuery)).toEqual(
      queries
    );
  });
});

describe("smartQueries with fuzzy matching distance 2", () => {
  beforeEach(() => {
    __setFuzzyMatchingDistance(2);
  });

  test.each<[string[], TestQuery[]]>([
    [
      ["a", "hello"],
      [
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello",
        },
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello*",
        },
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello~1",
        },
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello*~1",
        },
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello~2",
        },
        {
          tokens: ["a", "hello"],
          keyword: "+a +hello*~2",
        },
      ],
    ],
  ])("smartQueries(%j, zhDictionary) should work", (tokens, queries) => {
    expect(smartQueries(tokens, zhDictionary).map(transformQuery)).toEqual(
      queries
    );
  });
});

function transformQuery(query: SmartQuery): TestQuery {
  return {
    tokens: query.tokens,
    keyword: query.term
      .map(
        (item) =>
          `${item.presence === lunr.Query.presence.REQUIRED ? "+" : ""}${
            (item.wildcard & lunr.Query.wildcard.LEADING) ===
            lunr.Query.wildcard.LEADING
              ? "*"
              : ""
          }${item.value}${
            (item.wildcard & lunr.Query.wildcard.TRAILING) ===
            lunr.Query.wildcard.TRAILING
              ? "*"
              : ""
          }${
            typeof item.editDistance === "number" && item.editDistance > 0
              ? `~${item.editDistance}`
              : ""
          }`
      )
      .join(" "),
  };
}

describe("smartQueries with synonyms", () => {
  beforeEach(() => {
    __setLanguage(["en"]);
    __setRemoveDefaultStopWordFilter([]);
    __setFuzzyMatchingDistance(0);
    __setSynonyms([["CSS", "styles"], ["JavaScript", "JS"]]);
  });

  test.each<[string[], TestQuery[]]>([
    [
      ["CSS"],
      [
        {
          tokens: ["css", "styles"],
          keyword: "+css +styles",
        },
        {
          tokens: ["css", "styles"],
          keyword: "+css +styles*",
        },
      ],
    ],
    [
      ["styles"],
      [
        {
          tokens: ["css", "styles"],
          keyword: "+css +styles",
        },
        {
          tokens: ["css", "styles"],
          keyword: "+css +styles*",
        },
      ],
    ],
    [
      ["JavaScript"],
      [
        {
          tokens: ["javascript", "js"],
          keyword: "+javascript +js",
        },
        {
          tokens: ["javascript", "js"],
          keyword: "+javascript +js*",
        },
      ],
    ],
    [
      ["guide", "CSS"],
      [
        {
          tokens: ["guide", "css", "styles"],
          keyword: "+guide +css +styles",
        },
        {
          tokens: ["guide", "css", "styles"],
          keyword: "+guide +css +styles*",
        },
        {
          tokens: ["guide", "css"],
          keyword: "+guide +css",
        },
        {
          tokens: ["guide", "styles"],
          keyword: "+guide +styles",
        },
        {
          tokens: ["css", "styles"],
          keyword: "+css +styles",
        },
        {
          tokens: ["guide", "styles"],
          keyword: "+guide +styles*",
        },
        {
          tokens: ["css", "styles"],
          keyword: "+css +styles*",
        },
      ],
    ],
  ])("smartQueries(%j, []) with synonyms should work", (tokens, queries) => {
    expect(smartQueries(tokens, []).map(transformQuery)).toEqual(queries);
  });
});
