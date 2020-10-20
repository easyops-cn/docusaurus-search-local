import fs from "fs";
import { parse } from "./parse";
import { DocInfo } from "../../shared/interfaces";

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
    const docInfoList: DocInfo[] = [
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
        };
      }
    });
    const allDocuments = await scanDocuments(docInfoList);
    expect(allDocuments).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "i": 1,
            "t": "Hello First Docs",
            "u": "/1",
          },
          Object {
            "i": 5,
            "t": "Hello First Page",
            "u": "/2",
          },
        ],
        Array [
          Object {
            "i": 3,
            "p": 1,
            "t": "First heading",
            "u": "/1#first-heading",
          },
        ],
        Array [
          Object {
            "i": 2,
            "p": 1,
            "t": "Leading content.",
            "u": "/1",
          },
          Object {
            "i": 4,
            "p": 1,
            "t": "First content.",
            "u": "/1#first-heading",
          },
        ],
      ]
    `);
  });
});
