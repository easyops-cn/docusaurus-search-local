import { SearchDocumentType } from "../../../shared/interfaces";
import { SuggestionTemplate } from "./SuggestionTemplate";

jest.mock("./icons");
jest.mock("../../utils/proxiedGenerated");

describe("SuggestionTemplate", () => {
  test("page title", () => {
    const div = document.createElement("div");
    div.innerHTML = SuggestionTemplate({
      document: {
        i: 10,
        t: "Hello world",
        u: "/docs/a",
      },
      type: SearchDocumentType.Title,
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
          class="hitIcon"
        >
          <svg
            class="icon-title"
          />
        </span>
        <span
          class="hitWrapper"
        >
          <span
            class="hitTitle"
          >
            <mark>
              Hello
            </mark>
             world
          </span>
        </span>
        <span
          class="hitAction"
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
      type: SearchDocumentType.Heading,
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
        <span
          class="hitTree"
        >
          <svg
            class="icon-tree-inner"
          />
        </span>
        <span
          class="hitIcon"
        >
          <svg
            class="icon-heading"
          />
        </span>
        <span
          class="hitWrapper"
        >
          <span
            class="hitTitle"
          >
            <mark>
              Hello
            </mark>
             fruits.
          </span>
          <span
            class="hitPath"
          >
            Hello world
          </span>
        </span>
        <span
          class="hitAction"
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
      type: SearchDocumentType.Content,
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
        <span
          class="hitTree"
        >
          <svg
            class="icon-tree-last"
          />
        </span>
        <span
          class="hitIcon"
        >
          <svg
            class="icon-content"
          />
        </span>
        <span
          class="hitWrapper"
        >
          <span
            class="hitTitle"
          >
            <mark>
              Goodbye
            </mark>
             fruits.
          </span>
          <span
            class="hitPath"
          >
            Hello world
          </span>
        </span>
        <span
          class="hitAction"
        >
          <svg
            class="icon-action"
          />
        </span>
      </div>
    `);
  });
});
