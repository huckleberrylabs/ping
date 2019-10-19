import { Get } from ".";

describe("environment", () => {
  test("should be test", () => {
    expect(Get()).toBe("test");
  });
});
