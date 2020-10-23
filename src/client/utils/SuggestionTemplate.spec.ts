import { SuggestionTemplate } from "./SuggestionTemplate";

jest.mock("./icons");
jest.mock("./proxiedGenerated");

describe("SuggestionTemplate", () => {
  test("page title", () => {
    const div = document.createElement("div");
    div.innerHTML = SuggestionTemplate({
      document: {
        i: 10,
        t: "Hello world",
        u: "/docs/a",
      },
      type: 0,
      page: false,
      metadata: {
        hello: {
          t: {
            position: [[0, 5]],
          },
        },
      },
      tokens: [],
      isInterOfTree: false,
      isLastOfTree: false,
    });
    expect(div).toMatchInlineSnapshot(`
      <div>
        <span
          class="doc-search-hit-icon"
        >
          <svg
            class="icon-title"
          />
        </span>
        <span
          class="doc-search-hit-wrapper"
        >
          <span
            class="doc-search-hit-title"
          >
            <mark>
              Hello
            </mark>
             world
          </span>
        </span>
        <span
          class="doc-search-hit-action"
        >
          <svg
            class="icon-action"
          />
        </span>
      </div>
    `);
  });

  test("heading", () => {
    const div = document.createElement("div");
    div.innerHTML = SuggestionTemplate({
      document: {
        i: 20,
        t: "Hello fruits.",
        u: "/docs/b",
      },
      type: 1,
      page: {
        i: 1,
        t: "Hello world",
        u: "/docs/a",
      },
      metadata: {
        hello: {
          t: {
            position: [[0, 5]],
          },
        },
      },
      tokens: [],
      isInterOfTree: true,
      isLastOfTree: false,
    });
    expect(div).toMatchInlineSnapshot(`
      <div>
        <svg
          class="icon-tree-inner"
        />
        <span
          class="doc-search-hit-icon"
        >
          <svg
            class="icon-heading"
          />
        </span>
        <span
          class="doc-search-hit-wrapper"
        >
          <span
            class="doc-search-hit-title"
          >
            <mark>
              Hello
            </mark>
             fruits.
          </span>
          <span
            class="doc-search-hit-path"
          >
            Hello world
          </span>
        </span>
        <span
          class="doc-search-hit-action"
        >
          <svg
            class="icon-action"
          />
        </span>
      </div>
    `);
  });

  test("content", () => {
    const div = document.createElement("div");
    div.innerHTML = SuggestionTemplate({
      document: {
        i: 20,
        t: "Goodbye fruits.",
        u: "/docs/c",
      },
      type: 2,
      page: {
        i: 1,
        t: "Hello world",
        u: "/docs/a",
      },
      metadata: {
        Goodbye: {
          t: {
            position: [[0, 7]],
          },
        },
      },
      tokens: [],
      isInterOfTree: false,
      isLastOfTree: true,
    });
    expect(div).toMatchInlineSnapshot(`
      <div>
        <svg
          class="icon-tree-last"
        />
        <span
          class="doc-search-hit-icon"
        >
          <svg
            class="icon-content"
          />
        </span>
        <span
          class="doc-search-hit-wrapper"
        >
          <span
            class="doc-search-hit-title"
          >
            <mark>
              Goodbye
            </mark>
             fruits.
          </span>
          <span
            class="doc-search-hit-path"
          >
            Hello world
          </span>
        </span>
        <span
          class="doc-search-hit-action"
        >
          <svg
            class="icon-action"
          />
        </span>
      </div>
    `);
  });
});
