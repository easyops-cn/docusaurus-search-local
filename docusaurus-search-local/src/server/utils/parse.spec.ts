import {
  ParsedDocument,
  ProcessedPluginOptions,
} from "../../shared/interfaces";
import { parse } from "./parse";

describe("parse", () => {
  test.each<[string, "docs" | "blog" | "page", ParsedDocument | null]>([
    [
      `<head>
        <meta name="description" content="Hello Description">
        <meta name="keywords" content="Hello,Keywords">
      </head>
      <body>
        <article>
          <header>
            <h1>Hello World</h1>
          </header>
          <main>
            Peace.
            <div class="mdxCodeBlock_abc">
              Code.
              <button>Copy</button>
            </div>
          </main>
        </article>
      </body>`,
      "page",
      {
        pageTitle: "Hello World",
        description: "Hello Description",
        keywords: "Hello,Keywords",
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "Peace. Code.",
          },
        ],
        breadcrumb: [],
      },
    ],
    [
      `<body>
        <article>
          <header>
            <h1>Hello World</h1>
          </header>
          <main>
            <span class="badge">Version:1.0.0</span>
            Peace.
          </main>
        </article>
      </body>`,
      "docs",
      {
        pageTitle: "Hello World",
        description: "",
        keywords: "",
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "Peace.",
          },
        ],
        breadcrumb: [],
      },
    ],
    [
      `<body>
        <article>
          <header>
            <h1>Hello World</h1>
          </header>
          <main>
            <span class="ignore">Test</span>
            Peace.
          </main>
        </article>
      </body>`,
      "docs",
      {
        pageTitle: "Hello World",
        description: "",
        keywords: "",
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "Peace.",
          },
        ],
        breadcrumb: [],
      },
    ],
    [
      `<head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>
        <article>
          <header>
            <h1>Hello World</h1>
          </header>
          <main>
            <span class="ignore">Test</span>
            Peace.
          </main>
        </article>
      </body>`,
      "docs",
      null,
    ],
  ])("parse(...) should work", (html, type, doc) => {
    expect(
      parse(html, type, "", {
        ignoreCssSelectors: [".ignore"],
      } as ProcessedPluginOptions)
    ).toEqual(doc);
  });
});
