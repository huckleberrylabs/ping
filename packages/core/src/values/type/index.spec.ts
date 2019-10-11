import { pipe } from "fp-ts/lib/pipeable";
import { Is, Codec, T } from ".";
import { map } from "fp-ts/lib/Either";

describe("type", () => {
  test("it guards", () => {
    expect(Is("this-is-a-type")).toBeTruthy();
    expect(Is("")).toBeFalsy();
  });
  test("it encodes/decodes", () => {
    pipe(
      "my-type" as T,
      Codec.encode,
      Codec.decode,
      map(type => expect(Is(type)).toBeTruthy())
    );
  });
});
