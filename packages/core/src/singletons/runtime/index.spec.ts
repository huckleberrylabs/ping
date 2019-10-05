import { GetRuntime } from ".";

describe("RUNTIME", () => {
  test("should be node", () => {
    expect(GetRuntime()).toBe("node");
  });
});
