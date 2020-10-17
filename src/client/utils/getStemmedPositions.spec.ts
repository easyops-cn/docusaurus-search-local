import { getStemmedPositions } from "./getStemmedPositions";

describe("getStemmedPositions", () => {
  test("flatten and sort positions", () => {
    expect(
      getStemmedPositions(
        {
          dr: {
            body: {
              position: [
                [9, 2],
                [24, 2],
              ],
            },
          },
          dream: {
            body: {
              position: [
                [9, 5],
                [24, 5],
              ],
            },
          },
          true: {
            body: {
              position: [[36, 4]],
            },
          },
          unknown: {},
        },
        "body"
      )
    ).toEqual([
      [9, 5],
      [9, 2],
      [24, 5],
      [24, 2],
      [36, 4],
    ]);
  });
});
