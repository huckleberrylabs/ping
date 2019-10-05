import { Either, left, right } from "fp-ts/lib/Either";
export type ENV = "development" | "test" | "staging" | "production";

export const IsENV = (input: unknown): input is ENV =>
  typeof input === "string" &&
  (input === "development" ||
    input === "test" ||
    input === "staging" ||
    input === "production");

export const GetENV = (): Either<Error, ENV> =>
  IsENV(process.env.NODE_ENV)
    ? right(process.env.NODE_ENV)
    : left(new Error(`unknown NODE_ENV: ${process.env.NODE_ENV} `));
