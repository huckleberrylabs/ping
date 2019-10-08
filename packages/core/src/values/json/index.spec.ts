import { IsJSON } from ".";

describe("json", () => {
  test("primitives", () => {
    expect(IsJSON("json")).toBeTruthy();
    expect(IsJSON(5)).toBeTruthy();
    expect(IsJSON(0.5454)).toBeTruthy();
    expect(IsJSON(true)).toBeTruthy();
    expect(IsJSON(false)).toBeTruthy();
    expect(IsJSON(null)).toBeTruthy();
    expect(IsJSON(Symbol())).toBeFalsy();
    expect(IsJSON(() => {})).toBeFalsy();
  });
  test("arrays", () => {
    expect(IsJSON([])).toBeTruthy();
    expect(IsJSON([{}])).toBeTruthy();
    expect(IsJSON(["json"])).toBeTruthy();
    expect(IsJSON([555.55])).toBeTruthy();
    expect(IsJSON([555.55, "json"])).toBeTruthy();
    expect(IsJSON([555.55, "json", {}])).toBeTruthy();
    expect(IsJSON([{ symbol: Symbol() }])).toBeFalsy();
    expect(IsJSON([{ method: () => {} }])).toBeFalsy();
    expect(IsJSON([555.55, "json", Symbol()])).toBeFalsy();
    expect(IsJSON([555.55, "json", () => {}])).toBeFalsy();
  });
  test("objects", () => {
    expect(IsJSON({ json: { json: { json: "" } } })).toBeTruthy();
    expect(IsJSON({ number: 0.5454, boolean: true, object: {} })).toBeTruthy();
    expect(IsJSON({ symbol: Symbol() })).toBeFalsy();
    expect(IsJSON({ method: () => {} })).toBeFalsy();
  });
});
