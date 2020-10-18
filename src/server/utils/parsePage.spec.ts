import cheerio from "cheerio";
import { ParsedDocument } from "../../shared/interfaces";
import { parsePage } from "./parsePage";

describe("parsePage", () => {
  test.each<[string, string, ParsedDocument]>([
    [
      `<body>
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
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "Peace.",
          },
        ],
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
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "Peace.",
          },
        ],
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
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "",
          },
        ],
      },
    ],
  ])("parsePage(...) should work", (html, url, doc) => {
    expect(parsePage(cheerio.load(html), url)).toEqual(doc);
  });
});
