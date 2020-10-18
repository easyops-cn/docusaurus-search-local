import cheerio from "cheerio";
import { ParsedDocument } from "../../shared/interfaces";
import { parseDocument } from "./parseDocument";

describe("parseDocument", () => {
  test.each<[string, ParsedDocument]>([
    [
      `<body>
        <article>
          <header>
            <h1>Hello World</h1>
          </header>
          <div class="markdown">
            <h2>
              Hello fruits.
              <a aria-hidden="true" tabindex="-1" class="hash-link" href="#hello-fruits" title="Direct link to heading">#</a>
            </h2>
            <ul id="fruits">
              <li class="apple">Apple</li>
              <li class="orange">Orange</li>
              <li class="pear">Pear</li>
            </ul>
            <h3>
              Goodbye fruits.
              <a aria-hidden="true" tabindex="-1" class="hash-link" href="#goodbye-fruits" title="Direct link to heading">#</a>
            </h3>
          </div>
        </article>
      </body>`,
      {
        pageTitle: "Hello World",
        sections: [
          {
            title: "Hello fruits.",
            hash: "#hello-fruits",
            content: "Apple Orange Pear",
          },
          {
            title: "Goodbye fruits.",
            hash: "#goodbye-fruits",
            content: "",
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
            <p>Peace.</p>
            <h2>
              Hello fruits.
              <a aria-hidden="true" tabindex="-1" class="hash-link" href="#hello-fruits" title="Direct link to heading">#</a>
            </h2>
            <ul id="fruits">
              <li class="apple">Apple</li>
              <li class="orange">Orange</li>
              <li class="pear">Pear</li>
            </ul>
            <h3>
              Goodbye fruits.
              <a aria-hidden="true" tabindex="-1" class="hash-link" href="#goodbye-fruits" title="Direct link to heading">#</a>
            </h3>
          </div>
        </article>
      </body>`,
      {
        pageTitle: "Hello World",
        sections: [
          {
            title: "Hello World",
            hash: "",
            content: "Peace.",
          },
          {
            title: "Hello fruits.",
            hash: "#hello-fruits",
            content: "Apple Orange Pear",
          },
          {
            title: "Goodbye fruits.",
            hash: "#goodbye-fruits",
            content: "",
          },
        ],
      },
    ],
  ])("parseDocument(...) should work", (html, doc) => {
    expect(parseDocument(cheerio.load(html))).toEqual(doc);
  });
});
