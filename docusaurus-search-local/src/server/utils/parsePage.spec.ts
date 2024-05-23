import cheerio from "cheerio";
import { ParsedDocument } from "../../shared/interfaces";
import { parsePage } from "./parsePage";

describe("parsePage", () => {
  test.each<[string, string, ParsedDocument]>([
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
          </main>
        </article>
      </body>`,
      "/pages/a",
      {
        pageTitle: "Hello World",
        description: "Hello Description",
        keywords: "Hello,Keywords",
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
      `<title>Hello World</title>
      <body>
        <article>
          <main>
            Peace.
          </main>
        </article>
      </body>`,
      "/pages/a",
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
          <div class="markdown">
            Peace.
          </div>
        </article>
      </body>`,
      "/pages/a",
      {
        pageTitle: "Hello World",
        description: "",
        keywords: "",
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "",
          },
        ],
        breadcrumb: [],
      },
    ],
    [
      `<body>
        <article>
          <div class="markdown">
            <h1>Hello World</h1>
            Peace.
          </div>
        </article>
      </body>`,
      "/pages/a",
      {
        pageTitle: "Hello World",
        description: "",
        keywords: "",
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "",
          },
        ],
        breadcrumb: [],
      },
    ],
  ])("parsePage(...) should work", (html, url, doc) => {
    expect(parsePage(cheerio.load(html), url)).toEqual(doc);
  });
});
