import * as Error from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { isRight } from "fp-ts/lib/Either";

describe("core:error:adapter", () => {
  test("construct, encode, decode", () => {
    pipe(
      Error.C(),
      error => expect(error).toBeTruthy()
    );
    pipe(
      Error.C(),
      Error.Codec.encode,
      error => expect(error).toBeTruthy()
    );
    pipe(
      Error.C(),
      Error.Codec.encode,
      Error.Codec.decode,
      error => expect(isRight(error)).toBeTruthy()
    );
  });
});
