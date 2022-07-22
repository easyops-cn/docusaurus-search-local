import cheerio from "cheerio";
import { getCondensedText } from "./getCondensedText";

describe("getCondensedText", () => {
  const html = `
    <div id="root">
      <!-- comments should be ignored. -->
      Hello fruits.
      <ul id="fruits">
        <li class="apple">Apple</li>
        <li class="orange">Orange</li>
        <li class="pear">Pear</li>
      </ul>
      <span>Good</span><span>bye</span> fruits.
      <code>
        <span>Hello</span><br>
        <span>World</span>
      </code>
    <div>
  `;
  const $ = cheerio.load(html);

  test.each<[string, string]>([
    ["#fruits", "Apple Orange Pear"],
    ["#root", "Hello fruits. Apple Orange Pear Goodbye fruits. Hello World"],
  ])("getCondensedText($('%s'), $) should return '%s'", (selector, text) => {
    expect(getCondensedText($(selector).get(), $)).toBe(text);
  });
});
