import { Is } from ".";

describe("json", () => {
  test("primitives", () => {
    expect(Is("json")).toBeTruthy();
    expect(Is(5)).toBeTruthy();
    expect(Is(0.5454)).toBeTruthy();
    expect(Is(true)).toBeTruthy();
    expect(Is(false)).toBeTruthy();
    expect(Is(null)).toBeTruthy();
    expect(Is(Symbol())).toBeFalsy();
    expect(Is(() => {})).toBeFalsy();
  });
  test("arrays", () => {
    expect(Is([])).toBeTruthy();
    expect(Is([{}])).toBeTruthy();
    expect(Is(["json"])).toBeTruthy();
    expect(Is([555.55])).toBeTruthy();
    expect(Is([555.55, "json"])).toBeTruthy();
    expect(Is([555.55, "json", {}])).toBeTruthy();
    expect(Is([{ symbol: Symbol() }])).toBeFalsy();
    expect(Is([{ method: () => {} }])).toBeFalsy();
    expect(Is([555.55, "json", Symbol()])).toBeFalsy();
    expect(Is([555.55, "json", () => {}])).toBeFalsy();
  });
  test("objects", () => {
    expect(Is({ json: { json: { json: "" } } })).toBeTruthy();
    expect(Is({ number: 0.5454, boolean: true, object: {} })).toBeTruthy();
    expect(Is({ symbol: Symbol() })).toBeFalsy();
    expect(Is({ method: () => {} })).toBeFalsy();
  });
});
