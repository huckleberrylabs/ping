import { ID } from ".";

describe("ID Class", () => {
  const validIDString = "test-id-string-test-id-string-test-id-string";
  const invalidIDString = "test-id-string";
  it("should construct with a valid input string", () => {
    expect(new ID(validIDString)).toBeTruthy();
  });
  it("should not construct with an invalid input string", () => {
    let errorFlag = false;
    try {
      new ID(invalidIDString);
    } catch (error) {
      errorFlag = true;
    }
    expect(errorFlag).toBeTruthy();
  });
  it("should construct without an input string", () => {
    expect(new ID()).toBeTruthy();
  });
  it("should not evaluate different IDs as equal", () => {
    const id = new ID();
    const id2 = new ID();
    expect(id.equals(id2)).toBeFalsy();
  });
  it("should return the same string provided in the constructor", () => {
    const id = new ID(validIDString);
    expect(id.toString() === validIDString).toBeTruthy();
  });
});
