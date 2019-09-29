import { RUNTIME } from ".";

describe("RUNTIME", () => {
  test("should be node", () => {
    expect(RUNTIME).toBe("node");
  });
});
