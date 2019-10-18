import { Get } from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";

describe("RUNTIME", () => {
  test("should be node", () => {
    pipe(
      Get(),
      map(a => expect(a).toBe("node"))
    );
  });
});
