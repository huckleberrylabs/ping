import { Phone } from "./index";
import { map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

describe("phone", () => {
  test("it decodes", () => {
    pipe(
      Phone("9055823651"),
      map(input => expect(typeof input === "string").toBe(true))
    );
  });
});
