import { pipe } from "fp-ts/lib/pipeable";
import { Is, C, Codec } from ".";
import { map } from "fp-ts/lib/Either";

describe("uuid", () => {
  test("it constructs", () => {
    expect(C()).toBeTruthy();
  });
  test("it guards", () => {
    expect(Is(C())).toBeTruthy();
  });
  test("it encodes/decodes", () => {
    pipe(
      C(),
      Codec.encode,
      Codec.decode,
      map(timestamp => expect(Is(timestamp)).toBeTruthy())
    );
  });
});
