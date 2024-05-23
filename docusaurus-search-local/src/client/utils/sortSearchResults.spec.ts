import {
  InitialSearchResult,
  SearchDocumentType,
} from "../../shared/interfaces";
import { sortSearchResults } from "./sortSearchResults";

describe("sortSearchResults", () => {
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
          i: 3,
        },
        type: SearchDocumentType.Heading,
        page: {},
      },
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
      pageTitles[1],
      {
        document: {
          i: 101,
        },
        type: SearchDocumentType.Description,
        page: pageTitles[0].document,
      },
    ] as InitialSearchResult[];
    sortSearchResults(results);
    expect(results.map((item) => item.document.i)).toEqual([
      1, 2, 100, 101, 3, 200, 201, 202,
    ]);
  });
});
