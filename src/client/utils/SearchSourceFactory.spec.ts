import lunr from "lunr";
import { SearchDocument } from "../../shared/interfaces";
import { SearchSourceFactory } from "./SearchSourceFactory";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("lunr-languages/lunr.stemmer.support")(lunr);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("../../shared/lunrLanguageZh").lunrLanguageZh(lunr);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("lunr-languages/lunr.multi")(lunr);

jest.mock("./proxiedGenerated");

describe("SearchSourceFactory", () => {
  const documentsOfTitles: SearchDocument[] = [
    {
      i: 1,
      t: "First Page Title",
      u: "/1",
    },
    {
      i: 4,
      t: "Second Page Title > peace",
      u: "/2",
    },
  ];
  const documentsOfHeadings: SearchDocument[] = [
    {
      i: 2,
      t: "First heading > peace",
      u: "/1#2",
      p: 1,
    },
  ];
  const documentsOfContents: SearchDocument[] = [
    {
      i: 3,
      t: "First content. > peace",
      u: "/1#2",
      p: 1,
    },
  ];

  const getIndex = (documents: SearchDocument[]) =>
    lunr(function () {
      this.ref("i");
      this.field("t");
      this.metadataWhitelist = ["position"];
      documents.forEach((doc) => {
        this.add({
          ...doc,
          // The ref must be a string.
          i: doc.i.toString(),
        });
      });
    });

  const searchSource = SearchSourceFactory(
    [
      {
        documents: documentsOfTitles,
        index: getIndex(documentsOfTitles),
        type: 0,
      },
      {
        documents: documentsOfHeadings,
        index: getIndex(documentsOfHeadings),
        type: 1,
      },
      {
        documents: documentsOfContents,
        index: getIndex(documentsOfContents),
        type: 2,
      },
    ],
    [],
    2
  );
  const callback = jest.fn();

  test.each<[string, number[]]>([
    [",", []],
    ["nothing", []],
    ["peace", [4, 2]],
  ])(
    "SearchSourceFactory('%s', zhDictionary) should return %j",
    (input, results) => {
      searchSource(input, callback);
      expect(callback).toBeCalledWith(
        results.map((i) =>
          expect.objectContaining({
            document: expect.objectContaining({
              i,
            }),
          })
        )
      );
    }
  );
});
