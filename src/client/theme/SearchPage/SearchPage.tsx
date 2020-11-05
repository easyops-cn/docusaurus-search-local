import React, { useCallback, useEffect, useMemo, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";

import useSearchQuery from "../hooks/useSearchQuery";
import { fetchIndexes } from "../SearchBar/fetchIndexes";
import { SearchSourceFactory } from "../../utils/SearchSourceFactory";
import { SearchDocument, SearchResult } from "../../../shared/interfaces";
import { highlight } from "../../utils/highlight";
import { highlightStemmed } from "../../utils/highlightStemmed";
import { getStemmedPositions } from "../../utils/getStemmedPositions";
import LoadingRing from "../LoadingRing/LoadingRing";

import styles from "./SearchPage.module.css";

export default function SearchPage(): React.ReactElement {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const { searchValue, updateSearchPath } = useSearchQuery();
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [searchSource, setSearchSource] = useState<
    (input: string, callback: (results: SearchResult[]) => void) => void
  >();
  const [searchResults, setSearchResults] = useState<SearchResult[]>();

  const pageTitle = useMemo(
    () =>
      searchQuery
        ? `Search results for "${searchQuery}"`
        : "Search the documentation",
    [searchQuery]
  );

  useEffect(() => {
    updateSearchPath(searchQuery);

    if (searchSource) {
      if (searchQuery) {
        searchSource(searchQuery, (results) => {
          setSearchResults(results);
        });
      } else {
        setSearchResults(undefined);
      }
    }

    // `updateSearchPath` should not be in the deps,
    // otherwise will cause call stack overflow.
  }, [searchQuery, searchSource]);

  const handleSearchInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  useEffect(() => {
    if (searchValue && searchValue !== searchQuery) {
      setSearchQuery(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    async function doFetchIndexes() {
      const { wrappedIndexes, zhDictionary } = await fetchIndexes(baseUrl);
      setSearchSource(() =>
        SearchSourceFactory(wrappedIndexes, zhDictionary, 100)
      );
    }
    doFetchIndexes();
  }, [baseUrl]);

  return (
    <Layout title={pageTitle}>
      <Head>
        {/*
         We should not index search pages
          See https://github.com/facebook/docusaurus/pull/3233
        */}
        <meta property="robots" content="noindex, follow" />
      </Head>

      <div className="container margin-vert--lg">
        <h1>{pageTitle}</h1>

        <form>
          <input
            type="search"
            name="q"
            className={styles.searchQueryInput}
            aria-label="Search"
            onChange={handleSearchInputChange}
            value={searchQuery}
            autoComplete="off"
            autoFocus
          />
        </form>

        {!searchSource && searchQuery && (
          <div>
            <LoadingRing />
          </div>
        )}

        {searchResults &&
          (searchResults.length > 0 ? (
            <p>
              {searchResults.length} document
              {searchResults.length === 1 ? "" : "s"} found
            </p>
          ) : process.env.NODE_ENV === "production" ? (
            <p>No documents were found</p>
          ) : (
            <p>
              ⚠️ The search index is only available when you run docusaurus
              build!
            </p>
          ))}

        <section>
          {searchResults &&
            searchResults.map((item) => (
              <SearchResultItem key={item.document.i} searchResult={item} />
            ))}
        </section>
      </div>
    </Layout>
  );
}

function SearchResultItem({
  searchResult: { document, type, page, tokens, metadata },
}: {
  searchResult: SearchResult;
}): React.ReactElement {
  const isTitle = type === 0;
  const isContent = type === 2;
  const pathItems = ((isTitle
    ? document.b
    : (page as SearchDocument).b) as string[]).slice();
  const articleTitle = (isContent ? document.s : document.t) as string;
  if (!isTitle) {
    pathItems.push((page as SearchDocument).t);
  }
  return (
    <article className={styles.searchResultItem}>
      <h2>
        <Link
          to={document.u}
          dangerouslySetInnerHTML={{
            __html: isContent
              ? highlight(articleTitle, tokens)
              : highlightStemmed(
                  articleTitle,
                  getStemmedPositions(metadata, "t"),
                  tokens,
                  100
                ),
          }}
        ></Link>
      </h2>
      {pathItems.length > 0 && (
        <p className={styles.searchResultItemPath}>{pathItems.join(" › ")}</p>
      )}
      {isContent && (
        <p
          className={styles.searchResultItemSummary}
          dangerouslySetInnerHTML={{
            __html: highlightStemmed(
              document.t,
              getStemmedPositions(metadata, "t"),
              tokens,
              100
            ),
          }}
        />
      )}
    </article>
  );
}
