import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";
import { GetContext } from ".";
import { Type } from "../../values";

describe("context", () => {
  const testContext = "core:context:test" as Type;
  test(`should be ${testContext}`, () => {
    pipe(
      GetContext(),
      map(a => expect(a).toBe(testContext))
    );
  });
});
