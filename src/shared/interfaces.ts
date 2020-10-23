import lunr from "lunr";

export interface SmartQuery {
  tokens: string[];
  keyword: string;
}

export type SmartTerm = string[];

export interface WrappedTerm {
  missed: number;
  term: SmartTerm;
}

export type MetadataPosition = [number, number];

export interface MatchMetadata {
  [token: string]: {
    [field: string]: {
      position: MetadataPosition[];
    };
  };
}

export interface HighlightChunk {
  html: string;
  textLength: number;
}

export interface ChunkIndexRef {
  chunkIndex: number;
}

/**
 * properties of document is shorten for smaller serialized search index.
 */
export interface SearchDocument {
  /** Doc ID. */
  i: number;

  /** Doc title. */
  t: string;

  /** Doc URL. */
  u: string;

  /** Doc parent ID. */
  p?: number;
}

export type SearchDocumentType = 0 | 1 | 2;

export interface SearchResultBase {
  document: SearchDocument;
  type: SearchDocumentType;
  page: SearchDocument | undefined | false;
  metadata: MatchMetadata;
  tokens: string[];
}

export type SearchResult = SearchResultBase & SearchResultExtra;

export type InitialSearchResult = SearchResultBase & Partial<SearchResultExtra>;

export interface SearchResultExtra {
  score: number;
  index: number;
  isInterOfTree: boolean;
  isLastOfTree: boolean;
}

export interface WrappedIndex {
  documents: SearchDocument[];
  index: lunr.Index;
  type: SearchDocumentType;
}

export interface ParsedDocument {
  pageTitle: string;
  sections: ParsedDocumentSection[];
}

export interface ParsedDocumentSection {
  title: string;
  hash: string;
  content: string;
}

export interface DocInfoWithRoute {
  route: string;
  url: string;
  type: DocInfoType;
}

export interface DocInfoWithFilePath {
  filePath: string;
  url: string;
  type: DocInfoType;
}

export type DocInfoType = "docs" | "blog" | "page";

export interface PluginOptions {
  indexDocs?: boolean;
  indexBlog?: boolean;
  indexPages?: boolean;
  docsRouteBasePath?: string;
  blogRouteBasePath?: string;
  language?: string | string[];
  hashed?: boolean;
  docsDir?: string;
  blogDir?: string;
  removeDefaultStopWordFilter?: boolean;
  searchResultLimits?: number;
  searchResultContextMaxLength?: number;
}

export type ProcessedPluginOptions = Required<PluginOptions> & {
  language: string[];
};

export interface PostBuildData {
  routesPaths: string[];
  outDir: string;
  baseUrl: string;
}

export interface DocusaurusContext {
  siteDir: string;
  generatedFilesDir: string;
}
