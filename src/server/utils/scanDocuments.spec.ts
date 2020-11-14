import fs from "fs";
import { parse } from "./parse";
import { DocInfoWithFilePath } from "../../shared/interfaces";

jest.mock("./parse");
jest.spyOn(fs, "readFile").mockImplementation((((
  filePath,
  options,
  callback
) => {
  callback(null, filePath as any);
}) as unknown) as any);

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
    ];
    mockParse.mockImplementation((html) => {
      if (html.includes("1")) {
        return {
          pageTitle: "Hello First Docs",
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
      } else {
        return {
          pageTitle: "Hello First Page",
          sections: [
            {
              title: "Hello First Page",
              hash: "",
              content: "",
            },
          ],
          breadcrumb: [],
        };
      }
    });
    const allDocuments = await scanDocuments(DocInfoWithFilePathList);
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
        ],
      ]
    `);
  });
});
