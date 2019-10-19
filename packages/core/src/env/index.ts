import { left, right } from "fp-ts/lib/Either";
import * as Errors from "../errors";

export type T = "development" | "test" | "staging" | "production";

export const Is = (input: unknown): input is T =>
  typeof input === "string" &&
  (input === "development" ||
    input === "test" ||
    input === "staging" ||
    input === "production");

export const Get = () =>
  Is(process.env.NODE_ENV)
    ? right(process.env.NODE_ENV)
    : left(Errors.Environment.C());
