import { Either, left, right } from "fp-ts/lib/Either";
import * as Errors from "../../errors";

export type Env = "development" | "test" | "staging" | "production";

export const IsEnv = (input: unknown): input is Env =>
  typeof input === "string" &&
  (input === "development" ||
    input === "test" ||
    input === "staging" ||
    input === "production");

export const GetEnv = (): Either<Errors.Environment, Env> =>
  IsEnv(process.env.NODE_ENV)
    ? right(process.env.NODE_ENV)
    : left(new Errors.Environment(`unknown NODE_ENV: ${process.env.NODE_ENV}`));
