import { GetRuntime } from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";

describe("RUNTIME", () => {
  test("should be node", () => {
    pipe(
      GetRuntime(),
      map(a => expect(a).toBe("node"))
    );
  });
});
