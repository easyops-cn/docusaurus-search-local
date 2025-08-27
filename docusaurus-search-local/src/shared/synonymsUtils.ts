/**
 * Utility functions for handling synonyms expansion in both indexing and search.
 */

/**
 * Creates a map from each term to its synonyms group for fast lookup.
 */
export function createSynonymsMap(synonyms: string[][]): Map<string, string[]> {
  const synonymsMap = new Map<string, string[]>();
  
  for (const synonymGroup of synonyms) {
    // Normalize synonyms to lowercase for case-insensitive matching
    const normalizedGroup = synonymGroup.map(term => term.toLowerCase());
    
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
export function expandToken(token: string, synonymsMap: Map<string, string[]>): string[] {
  const normalizedToken = token.toLowerCase();
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
export function expandTokens(tokens: string[], synonymsMap: Map<string, string[]>): string[] {
  const expandedTokens: string[] = [];
  
  for (const token of tokens) {
    const expanded = expandToken(token, synonymsMap);
    expandedTokens.push(...expanded);
  }
  
  // Remove duplicates while preserving order
  return [...new Set(expandedTokens)];
}