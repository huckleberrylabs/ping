import { Either, left, right } from "fp-ts/lib/Either";
export type IRuntime = "browser" | "node";

export const GetRuntime = (): Either<Error, IRuntime> => {
  if (typeof window === "undefined") return right("node");
  if (typeof window === "object") return right("browser");
  return left(new Error(`unknown runtime: (window: ${typeof window})`));
};
