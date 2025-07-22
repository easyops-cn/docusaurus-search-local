import { resetDocId } from "./scanDocuments";

describe("scanDocuments determinism", () => {
  test("resetDocId function should be available for testing", () => {
    expect(typeof resetDocId).toBe("function");
    
    // Calling resetDocId should not throw
    expect(() => resetDocId()).not.toThrow();
  });
});