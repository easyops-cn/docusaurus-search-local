import * as lunr from "lunr";
import { SearchResult } from "../../shared/interfaces";
import { SearchSourceFactory } from "./SearchSourceFactory";

describe("SearchSourceFactory", () => {
  const searchSource = SearchSourceFactory(
    [
      {
        documents: [],
        index: ({
          search: jest.fn(() => []),
        } as unknown) as lunr.Index,
        type: 0,
      },
    ],
    []
  );
  const callback = jest.fn();

  test.each<[string, SearchResult[]]>([
    [",", []],
    ["api_gateway", []],
  ])(
    "SearchSourceFactory('%s', zhDictionary) should return %j",
    (input, results) => {
      searchSource(input, callback);
      expect(callback).toBeCalledWith(results);
    }
  );
});
