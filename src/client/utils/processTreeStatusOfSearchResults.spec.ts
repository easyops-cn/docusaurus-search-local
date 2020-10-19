import { InitialSearchResult } from "../../shared/interfaces";
import { processTreeStatusOfSearchResults } from "./processTreeStatusOfSearchResults";

describe("processTreeStatusOfSearchResults", () => {
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
          i: 101,
        },
        type: 2,
        page: pageTitles[0].document,
      },
      {
        document: {
          i: 3,
        },
        type: 1,
        page: {},
      },
      pageTitles[1],
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
    ] as InitialSearchResult[];
    processTreeStatusOfSearchResults(results);
    const statuses: [boolean, boolean][] = [
      [undefined, undefined],
      [undefined, undefined],
      [undefined, undefined],
      [undefined, true],
      [undefined, undefined],
      [undefined, undefined],
      [true, undefined],
      [undefined, true],
    ];
    results.forEach((item, i) => {
      expect([item.isInterOfTree, item.isLastOfTree]).toEqual(statuses[i]);
    });
  });
});
