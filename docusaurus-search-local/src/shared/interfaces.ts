import { DocusaurusConfig, LoadedPlugin } from "@docusaurus/types";
import lunr from "lunr";
import { PluginOptions } from "../";

export type { PluginOptions };

export type SmartTerm = SmartTermItem[];

export interface SmartTermItem {
  value: string;
  trailing?: boolean;
  maybeTyping?: boolean;
}

export interface SmartQuery {
  tokens: string[];
  term: QueryTerm;
}

export type QueryTerm = QueryTermItem[];

export interface QueryTermItem {
  value: string;
  presence: lunr.Query.presence;
  wildcard: lunr.Query.wildcard;
}

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

  /** Doc hash. */
  h?: string;

  /** Doc parent ID. */
  p?: number;

  /** Doc breadcrumb. */
  b?: string[];

  /** Doc section title */
  s?: string;
}

/**
 * - 0: Doc title
 * - 1: Doc heading
 * - 2: Doc content
 */
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
  breadcrumb: string[];
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

export interface VersionDocInfo {
  outDir: string;
  paths: DocInfoWithFilePath[];
}

export type DocInfoType = "docs" | "blog" | "page";

export type ProcessedPluginOptions = Required<
  Omit<
    PluginOptions,
    | "language"
    | "docsRouteBasePath"
    | "blogRouteBasePath"
    | "docsDir"
    | "blogDir"
    | "ignoreFiles"
    | "ignoreClasses"
  >
> & {
  docsRouteBasePath: string[];
  blogRouteBasePath: string[];
  language: string[];
  docsDir: string[];
  blogDir: string[];
  ignoreFiles: (string | RegExp)[];
  ignoreClasses: string[];
};

export interface PostBuildData {
  routesPaths: string[];
  outDir: string;
  baseUrl: string;
  siteConfig: DocusaurusConfig;
  plugins: LoadedPlugin[];
}

export interface DocusaurusContext {
  baseUrl: string;
  siteDir: string;
  generatedFilesDir: string;
  i18n: {
    currentLocale: string;
  };
  siteConfig: {
    themeConfig: {
      navbar?: {
        items?: {
          type: "search" | "doc";
          position: "left" | "right";
        }[];
      };
    };
  };
}
