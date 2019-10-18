import { left, right } from "fp-ts/lib/Either";
import * as Errors from "../errors";

export type T = "browser" | "node";

export const Get = () => {
  if (typeof window === "undefined") return right("node");
  if (typeof window === "object") return right("browser");
  return left(Errors.Environment.C());
};