import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "💪 Written in TypeScript",
    imageUrl: "img/undraw_docusaurus_mountain.svg",
    description: <>A Result You Can Trust.</>,
  },
  {
    title: "🌎 Multi Languages Supported",
    imageUrl: "img/undraw_docusaurus_tree.svg",
    description: <>Dozens of languages supported, including 中文分词 🇨🇳.</>,
  },
  {
    title: "💅 Styles polished",
    imageUrl: "img/undraw_docusaurus_react.svg",
    description: (
      <>
        Looks pretty good, actually just like the Algolia Search on Docusaurus
        v2 website.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">
            An offline/local search example using{" "}
            <a
              href="https://github.com/easyops-cn/docusaurus-search-local"
              style={{ color: "var(--ifm-hero-text-color)" }}
            >
              @easyops-cn/docusaurus-search-local
            </a>
            .
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={"#"}
            >
              Try the search bar on the top-right corner.
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
