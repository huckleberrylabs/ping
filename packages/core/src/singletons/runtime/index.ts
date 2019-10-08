import { Either, left, right } from "fp-ts/lib/Either";
import { EnvironmentError } from "../../errors";

export type Runtime = "browser" | "node";

export const GetRuntime = (): Either<EnvironmentError, Runtime> => {
  if (typeof window === "undefined") return right("node");
  if (typeof window === "object") return right("browser");
  return left(
    new EnvironmentError(`unknown runtime: (window: ${typeof window})`)
  );
};
