import cheerio from "cheerio";
import { ParsedDocument } from "../../shared/interfaces";
import { parseDocument } from "./parseDocument";

describe("parseDocument", () => {
  test.each<[string, ParsedDocument]>([
    [
      `<body>
        <nav>
          <a class="navbar__link navbar__link--active">
            Docs
          <a>
        </nav>
        <div class="main-wrapper">
          <div class="menu">
            <a class="menu__link menu__link--sublist">
              API
            </a>
            <a class="menu__link menu__link--sublist menu__link--active">
              Guide
            </a>
            <a class="menu__link menu__link--sublist menu__link--active">
              Advanced
            </a>
            <a class="menu__link menu__link--active">
              First Doc
            </a>
          </div>
        </div>
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
              <a tabindex="-1" class="hash-link" href="#goodbye-fruits" title="Direct link to heading">#</a>
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
            content: "",
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
        breadcrumb: ["Docs", "Guide", "Advanced"],
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
        breadcrumb: [],
      },
    ],
    [
      `<body>
        <article>
          <div class="markdown">
            <h1>Hello World</h1>
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
        breadcrumb: [],
      },
    ],
  ])("parseDocument(...) should work", (html, doc) => {
    expect(parseDocument(cheerio.load(html))).toEqual(doc);
  });
});
