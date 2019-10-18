import { Get } from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";

describe("environment", () => {
  test("should be test", () => {
    pipe(
      Get(),
      map(a => expect(a).toBe("test"))
    );
  });
});
