import { Either, left, right } from "fp-ts/lib/Either";
import * as Errors from "../../errors";

export type Runtime = "browser" | "node";

export const GetRuntime = (): Either<Errors.Environment, Runtime> => {
  if (typeof window === "undefined") return right("node");
  if (typeof window === "object") return right("browser");
  return left(
    new Errors.Environment(`unknown runtime: (window: ${typeof window})`)
  );
};
