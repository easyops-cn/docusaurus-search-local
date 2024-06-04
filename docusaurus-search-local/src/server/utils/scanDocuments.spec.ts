import fs from "fs";
import { parse } from "./parse";
import {
  DocInfoWithFilePath,
  ProcessedPluginOptions,
} from "../../shared/interfaces";

jest.mock("./parse");
jest.spyOn(fs, "readFile").mockImplementation(((
  filePath,
  options,
  callback
) => {
  callback(null, filePath as any);
}) as unknown as any);

// Use `require` to avoid *import hoisting*.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { scanDocuments } = require("./scanDocuments");

const mockParse = parse as jest.MockedFunction<typeof parse>;

describe("scanDocuments", () => {
  test("should work", async () => {
    const DocInfoWithFilePathList: DocInfoWithFilePath[] = [
      {
        filePath: "/tmp/1",
        url: "/1",
        type: "docs",
      },
      {
        filePath: "/tmp/2",
        url: "/2",
        type: "page",
      },
      {
        // Unlisted
        filePath: "/tmp/3",
        url: "/3",
        type: "docs",
      },
    ];
    mockParse.mockImplementation((html) => {
      if (html.includes("1")) {
        return {
          pageTitle: "Hello First Docs",
          description: "Hello Description",
          keywords: "Hello,Keywords",
          sections: [
            {
              title: "Hello First Docs",
              hash: "",
              content: "Leading content.",
            },
            {
              title: "First heading",
              hash: "#first-heading",
              content: "First content.",
            },
          ],
          breadcrumb: ["Docs"],
        };
      } else if (html.includes("2")) {
        return {
          pageTitle: "Hello First Page",
          sections: [
            {
              title: "Hello First Page",
              hash: "",
              content: "",
            },
            {
              title: "Second heading",
              hash: "/2#second-heading",
              content: "Second content.",
            },
            {
              title: "Third heading",
              hash: "/3#third-heading",
              content: "Third content.",
            },
          ],
          breadcrumb: [],
        };
      } else {
        return null;
      }
    });
    const allDocuments = await scanDocuments(
      DocInfoWithFilePathList,
      {} as ProcessedPluginOptions
    );
    expect(allDocuments).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "b": Array [
              "Docs",
            ],
            "i": 1,
            "t": "Hello First Docs",
            "u": "/1",
          },
          Object {
            "b": Array [],
            "i": 5,
            "t": "Hello First Page",
            "u": "/2",
          },
        ],
        Array [
          Object {
            "h": "#first-heading",
            "i": 3,
            "p": 1,
            "t": "First heading",
            "u": "/1",
          },
          Object {
            "h": "#second-heading",
            "i": 6,
            "p": 5,
            "t": "Second heading",
            "u": "/2",
          },
        ],
        Array [
          Object {
            "i": 1,
            "p": 1,
            "s": "Hello First Docs",
            "t": "Hello Description",
            "u": "/1",
          },
        ],
        Array [
          Object {
            "i": 1,
            "p": 1,
            "s": "Hello First Docs",
            "t": "Hello,Keywords",
            "u": "/1",
          },
        ],
        Array [
          Object {
            "h": "",
            "i": 2,
            "p": 1,
            "s": "Hello First Docs",
            "t": "Leading content.",
            "u": "/1",
          },
          Object {
            "h": "#first-heading",
            "i": 4,
            "p": 1,
            "s": "First heading",
            "t": "First content.",
            "u": "/1",
          },
          Object {
            "h": "#second-heading",
            "i": 7,
            "p": 5,
            "s": "Second heading",
            "t": "Second content.",
            "u": "/2",
          },
        ],
      ]
    `);
  });
});
