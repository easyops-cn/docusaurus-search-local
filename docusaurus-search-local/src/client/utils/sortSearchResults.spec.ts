import { InitialSearchResult } from "../../shared/interfaces";
import { sortSearchResults } from "./sortSearchResults";

describe("sortSearchResults", () => {
  test("should work", () => {
    const pageTitles = [
      {
        document: {
          i: 100,
        },
        type: 0,
        page: undefined,
      },
      {
        document: {
          i: 200,
        },
        type: 0,
        page: undefined,
      },
    ] as InitialSearchResult[];
    const results = [
      {
        document: {
          i: 1,
        },
        type: 2,
        page: {},
      },
      {
        document: {
          i: 2,
        },
        type: 1,
        page: {},
      },
      pageTitles[0],
      {
        document: {
          i: 3,
        },
        type: 1,
        page: {},
      },
      {
        document: {
          i: 201,
        },
        type: 1,
        page: pageTitles[1].document,
      },
      {
        document: {
          i: 202,
        },
        type: 2,
        page: pageTitles[1].document,
      },
      pageTitles[1],
      {
        document: {
          i: 101,
        },
        type: 2,
        page: pageTitles[0].document,
      },
    ] as InitialSearchResult[];
    sortSearchResults(results);
    expect(results.map((item) => item.document.i)).toEqual([
      1, 2, 100, 101, 3, 200, 201, 202,
    ]);
  });
});
