import { GetEnv } from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";

describe("environment", () => {
  test("should be test", () => {
    pipe(
      GetEnv(),
      map(a => expect(a).toBe("test"))
    );
  });
});
