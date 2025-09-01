/**
 * Utility functions for handling synonyms expansion in both indexing and search.
 */

/**
 * Creates a map from each term to its synonyms group for fast lookup.
 * Optionally applies stemming to normalize word forms.
 */
export function createSynonymsMap(
  synonyms: string[][],
  stemmerFn?: (word: string) => string
): Map<string, string[]> {
  const synonymsMap = new Map<string, string[]>();
  
  for (const synonymGroup of synonyms) {
    // Normalize synonyms to lowercase for case-insensitive matching
    let normalizedGroup = synonymGroup.map(term => term.toLowerCase());
    
    // Apply stemming if available to handle word variations like "style" vs "styles"
    if (stemmerFn) {
      normalizedGroup = normalizedGroup.map(term => stemmerFn(term));
    }
    
    for (const term of normalizedGroup) {
      // Each term maps to all terms in its group (including itself)
      synonymsMap.set(term, normalizedGroup);
    }
  }
  
  return synonymsMap;
}

/**
 * Expands a token to include its synonyms.
 * Returns an array of all equivalent terms for the given token.
 */
export function expandToken(
  token: string, 
  synonymsMap: Map<string, string[]>,
  stemmerFn?: (word: string) => string
): string[] {
  let normalizedToken = token.toLowerCase();
  
  // Apply stemming if available to match stemmed synonyms
  if (stemmerFn) {
    normalizedToken = stemmerFn(normalizedToken);
  }
  
  const synonyms = synonymsMap.get(normalizedToken);
  
  if (synonyms && synonyms.length > 1) {
    // Return all synonyms including the original token
    return synonyms;
  }
  
  // Return original token if no synonyms found
  return [normalizedToken];
}

/**
 * Expands an array of tokens to include their synonyms.
 * Returns a flattened array of all tokens and their synonyms.
 */
export function expandTokens(
  tokens: string[], 
  synonymsMap: Map<string, string[]>,
  stemmerFn?: (word: string) => string
): string[] {
  const expandedTokens: string[] = [];
  
  for (const token of tokens) {
    const expanded = expandToken(token, synonymsMap, stemmerFn);
    expandedTokens.push(...expanded);
  }
  
  // Remove duplicates while preserving order
  return [...new Set(expandedTokens)];
}

/**
 * Expands text content with synonyms for indexing.
 * This tokenizes the text, expands each token with synonyms, and joins them back.
 * This ensures that when content contains "style", it will also match searches for "css"
 * if ["css", "style"] are configured as synonyms.
 */
export function expandTextWithSynonyms(
  text: string, 
  synonymsMap: Map<string, string[]>,
  stemmerFn?: (word: string) => string
): string {
  if (!text || synonymsMap.size === 0) {
    return text;
  }
  
  // Simple tokenization - split by word boundaries and preserve structure
  const words = text.split(/(\W+)/);
  const expandedWords: string[] = [];
  
  for (const word of words) {
    if (/^\w+$/.test(word)) {
      // This is a word, check for synonyms
      const synonyms = expandToken(word, synonymsMap, stemmerFn);
      if (synonyms.length > 1) {
        // Add the original word plus all its synonyms separated by spaces
        expandedWords.push(synonyms.join(' '));
      } else {
        expandedWords.push(word);
      }
    } else {
      // This is punctuation/whitespace, keep as is
      expandedWords.push(word);
    }
  }
  
  return expandedWords.join('');
}