import {
  InitialSearchResult,
  SearchDocumentType,
} from "../../shared/interfaces";
import { processTreeStatusOfSearchResults } from "./processTreeStatusOfSearchResults";

describe("processTreeStatusOfSearchResults", () => {
  test("should work", () => {
    const pageTitles = [
      {
        document: {
          i: 100,
        },
        type: SearchDocumentType.Title,
        page: undefined,
      },
      {
        document: {
          i: 200,
        },
        type: SearchDocumentType.Title,
        page: undefined,
      },
      {
        document: {
          i: 300,
        },
        type: SearchDocumentType.Title,
        page: undefined,
      },
    ] as InitialSearchResult[];
    const results = [
      {
        document: {
          i: 1,
        },
        type: SearchDocumentType.Content,
        page: {},
      },
      {
        document: {
          i: 2,
        },
        type: SearchDocumentType.Heading,
        page: {},
      },
      pageTitles[0],
      {
        document: {
          i: 101,
        },
        type: SearchDocumentType.Content,
        page: pageTitles[0].document,
      },
      {
        document: {
          i: 3,
        },
        type: SearchDocumentType.Heading,
        page: {},
      },
      pageTitles[1],
      {
        document: {
          i: 201,
        },
        type: SearchDocumentType.Heading,
        page: pageTitles[1].document,
      },
      {
        document: {
          i: 202,
        },
        type: SearchDocumentType.Content,
        page: pageTitles[1].document,
      },
      {
        document: {
          i: 301,
        },
        type: SearchDocumentType.Keywords,
        page: pageTitles[2].document,
      },
      {
        document: {
          i: 302,
        },
        type: SearchDocumentType.Description,
        page: pageTitles[2].document,
      },
    ] as InitialSearchResult[];
    processTreeStatusOfSearchResults(results);
    const statuses: [boolean | undefined, boolean | undefined][] = [
      [undefined, undefined],
      [undefined, undefined],
      [undefined, undefined],
      [undefined, true],
      [undefined, undefined],
      [undefined, undefined],
      [true, undefined],
      [undefined, true],
      [undefined, undefined],
      [undefined, true],
    ];
    results.forEach((item, i) => {
      expect([item.isInterOfTree, item.isLastOfTree]).toEqual(statuses[i]);
    });
  });
});
