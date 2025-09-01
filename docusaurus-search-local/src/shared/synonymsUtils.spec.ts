import { createSynonymsMap, expandToken, expandTokens, expandTextWithSynonyms } from "./synonymsUtils";

describe("synonymsUtils", () => {
  describe("createSynonymsMap", () => {
    test("should create synonyms map from synonym groups", () => {
      const synonyms = [
        ["CSS", "styles"],
        ["JavaScript", "JS", "js"],
      ];
      
      const synonymsMap = createSynonymsMap(synonyms);
      
      expect(synonymsMap.get("css")).toEqual(["css", "styles"]);
      expect(synonymsMap.get("styles")).toEqual(["css", "styles"]);
      expect(synonymsMap.get("javascript")).toEqual(["javascript", "js", "js"]);
      expect(synonymsMap.get("js")).toEqual(["javascript", "js", "js"]);
    });

    test("should handle empty synonyms array", () => {
      const synonymsMap = createSynonymsMap([]);
      expect(synonymsMap.size).toBe(0);
    });

    test("should handle single-term groups", () => {
      const synonyms = [["onlyterm"]];
      const synonymsMap = createSynonymsMap(synonyms);
      
      expect(synonymsMap.get("onlyterm")).toEqual(["onlyterm"]);
    });
  });

  describe("expandToken", () => {
    const synonyms = [
      ["CSS", "styles"],
      ["JavaScript", "JS"],
    ];
    const synonymsMap = createSynonymsMap(synonyms);

    test("should expand token to its synonyms", () => {
      expect(expandToken("CSS", synonymsMap)).toEqual(["css", "styles"]);
      expect(expandToken("styles", synonymsMap)).toEqual(["css", "styles"]);
      expect(expandToken("JavaScript", synonymsMap)).toEqual(["javascript", "js"]);
      expect(expandToken("JS", synonymsMap)).toEqual(["javascript", "js"]);
    });

    test("should return original token if no synonyms", () => {
      expect(expandToken("unknown", synonymsMap)).toEqual(["unknown"]);
    });

    test("should be case insensitive", () => {
      expect(expandToken("css", synonymsMap)).toEqual(["css", "styles"]);
      expect(expandToken("STYLES", synonymsMap)).toEqual(["css", "styles"]);
    });
  });

  describe("expandTokens", () => {
    const synonyms = [
      ["CSS", "styles"],
      ["JavaScript", "JS"],
    ];
    const synonymsMap = createSynonymsMap(synonyms);

    test("should expand multiple tokens", () => {
      const tokens = ["CSS", "guide"];
      const expanded = expandTokens(tokens, synonymsMap);
      
      expect(expanded).toEqual(["css", "styles", "guide"]);
    });

    test("should remove duplicates", () => {
      const tokens = ["CSS", "styles"];
      const expanded = expandTokens(tokens, synonymsMap);
      
      expect(expanded).toEqual(["css", "styles"]);
    });

    test("should handle empty array", () => {
      expect(expandTokens([], synonymsMap)).toEqual([]);
    });

    test("should handle tokens without synonyms", () => {
      const tokens = ["unknown", "token"];
      const expanded = expandTokens(tokens, synonymsMap);
      
      expect(expanded).toEqual(["unknown", "token"]);
    });
  describe("expandTextWithSynonyms", () => {
    const synonyms = [
      ["CSS", "styles"],
      ["JavaScript", "JS"],
    ];
    const synonymsMap = createSynonymsMap(synonyms);

    test("should expand text content with synonyms", () => {
      const text = "Learn CSS basics and styling";
      const expanded = expandTextWithSynonyms(text, synonymsMap);
      
      expect(expanded).toContain("css styles");
      expect(expanded).toContain("styling");
    });

    test("should expand multiple words in content", () => {
      const text = "CSS and JavaScript guide";
      const expanded = expandTextWithSynonyms(text, synonymsMap);
      
      expect(expanded).toContain("css styles");
      expect(expanded).toContain("javascript js");
    });

    test("should preserve punctuation and spacing", () => {
      const text = "CSS, JavaScript!";
      const expanded = expandTextWithSynonyms(text, synonymsMap);
      
      expect(expanded).toContain(", ");
      expect(expanded).toContain("!");
    });

    test("should handle text without synonyms", () => {
      const text = "Regular text content";
      const expanded = expandTextWithSynonyms(text, synonymsMap);
      
      expect(expanded).toBe("Regular text content");
    });

    test("should handle empty text", () => {
      expect(expandTextWithSynonyms("", synonymsMap)).toBe("");
    });

    test("should handle empty synonyms map", () => {
      const emptySynonymsMap = new Map<string, string[]>();
      const text = "CSS and JavaScript";
      const expanded = expandTextWithSynonyms(text, emptySynonymsMap);
      
      expect(expanded).toBe("CSS and JavaScript");
    });

    test("should handle stemming with word variations", () => {
      // Simple mock stemmer that removes 's' suffix
      const mockStemmer = (word: string) => word.endsWith('s') ? word.slice(0, -1) : word;
      
      const synonymsWithStemming = [
        ["CSS", "styles"], // "styles" becomes "style" when stemmed
      ];
      const stemmedSynonymsMap = createSynonymsMap(synonymsWithStemming, mockStemmer);
      
      // Text contains "style" (singular)
      const text = "A comprehensive style guide";
      const expanded = expandTextWithSynonyms(text, stemmedSynonymsMap, mockStemmer);
      
      // Should expand "style" to include its synonyms because stemmed "styles" -> "style" matches "style"
      expect(expanded).toContain("css");
    });
  });
});