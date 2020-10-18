import { ParsedDocument } from "../../shared/interfaces";
import { parse } from "./parse";

describe("parse", () => {
  test.each<[string, "docs" | "blog" | "page", ParsedDocument]>([
    [
      `<body>
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
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "Peace. Code.",
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
          <main>
            <span class="badge">Version:1.0.0</span>
            Peace.
          </main>
        </article>
      </body>`,
      "docs",
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
  ])("parse(...) should work", (html, type, doc) => {
    expect(parse(html, type, "")).toEqual(doc);
  });
});
