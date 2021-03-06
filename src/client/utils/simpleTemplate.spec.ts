import { simpleTemplate } from "./simpleTemplate";

describe("simpleTemplate", () => {
  test.each<[string, Record<string, unknown>, string]>([
    [
      "search for '{{ keyword }}'",
      {
        keyword: "any"
      },
      "search for 'any'"
    ],
    [
      "{{ count }} documents found",
      {
        count: 2
      },
      "2 documents found"
    ],
  ])("simpleTemplate(%j, $j) should return %j", (template, params, result) => {
    expect(simpleTemplate(template, params)).toBe(result);
  });
});
