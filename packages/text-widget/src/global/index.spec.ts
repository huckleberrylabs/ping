import { GLOBAL } from ".";

describe("GLOBAL", () => {
  test("global object should exist", () => {
    expect(typeof GLOBAL).toBe("object");
  });
});
