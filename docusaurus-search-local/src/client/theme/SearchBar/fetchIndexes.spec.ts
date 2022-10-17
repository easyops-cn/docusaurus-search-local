import lunr from "lunr";
import { legacyFetchIndexes as fetchIndexes } from "./fetchIndexes";

jest.mock("lunr");
jest.mock("../../utils/proxiedGenerated");

const mockLunrIndexLoad = (
  jest.spyOn(lunr.Index, "load") as any
).mockImplementation(() => `loaded-index`);

const mockFetch = (global.fetch = jest.fn());

describe("fetchIndexes", () => {
  const baseUrl = "/";

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });

  test("production with empty index", async () => {
    process.env.NODE_ENV = "production";
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    });
    const result = await fetchIndexes(baseUrl, "");
    expect(mockFetch).toBeCalledWith("/search-index.json?_=abc");
    expect(result).toEqual({
      wrappedIndexes: [],
      zhDictionary: [],
    });
  });

  test("production", async () => {
    process.env.NODE_ENV = "production";
    mockLunrIndexLoad;
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve([
          {
            documents: [1, 2, 3],
            index: {
              invertedIndex: [
                ["hello"],
                ["alfabetização"],
                ["世界"],
                ["和平"],
                ["世界"],
                ["hello"],
              ],
            },
          },
        ]),
    });
    const result = await fetchIndexes(baseUrl, "community");
    expect(mockFetch).toBeCalledWith("/search-index-community.json?_=abc");
    expect(result).toEqual({
      wrappedIndexes: [
        {
          documents: [1, 2, 3],
          index: "loaded-index",
          type: 0,
        },
      ],
      zhDictionary: ["世界", "和平"],
    });
  });

  test("development", async () => {
    process.env.NODE_ENV = "development";
    const result = await fetchIndexes(baseUrl, "");
    expect(mockFetch).not.toBeCalled();
    expect(result).toEqual({
      wrappedIndexes: [],
      zhDictionary: [],
    });
  });
});
