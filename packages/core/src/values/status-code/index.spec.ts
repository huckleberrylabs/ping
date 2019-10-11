import { Is, IsSuccess, IsError } from ".";

describe("status-code", () => {
  test("typeguard", () => {
    expect(Is(6777)).toBeFalsy();
  });
  test("success", () => {
    expect(IsSuccess(200)).toBeTruthy();
  });
  test("error", () => {
    expect(IsError(500)).toBeTruthy();
  });
});
