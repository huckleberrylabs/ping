import { pipe } from "fp-ts/lib/pipeable";
import { IsType, TypeCodec, Type } from ".";
import { map } from "fp-ts/lib/Either";

describe("type", () => {
  test("it guards", () => {
    expect(IsType("this-is-a-type")).toBeTruthy();
    expect(IsType("")).toBeFalsy();
  });
  test("it encodes/decodes", () => {
    pipe(
      "my-type" as Type,
      TypeCodec.encode,
      TypeCodec.decode,
      map(type => expect(IsType(type)).toBeTruthy())
    );
  });
});
