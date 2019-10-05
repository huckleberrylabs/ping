import { GetENV } from ".";

describe("ENV", () => {
  test("should be test", () => {
    expect(GetENV()).toBe("test");
  });
});
