import { ENV } from ".";

describe("ENV", () => {
  test("should be test", () => {
    expect(ENV).toBe("test");
  });
});
