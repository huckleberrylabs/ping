import { pipe } from "fp-ts/lib/pipeable";
import {
  tryCatch,
  isRight,
  Either,
  right,
  left,
  map,
  flatten,
} from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { URL } from "url";
import normalize from "normalize-url";
import * as Errors from "../../errors";
import * as NonEmptyString from "../non-empty-string";

export interface Brand {
  readonly Url: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => isRight(C(input)),
  "Url"
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  input: string
): Either<Errors.Validation | Errors.Parsing, T> =>
  pipe(
    NonEmptyString.Is(input)
      ? right(input)
      : left(new Errors.Validation("cannot be empty")),
    map(Parse),
    flatten,
    map(Normalize),
    map(Format)
  );

/* 
  - checks if valid
  - lowercases scheme and host
  - removes default port
*/
export const Parse = (input: string) =>
  tryCatch(() => new URL(input).toString(), () => new Errors.Parsing());

/*
  - removes trailing slash
  - removes default directory indexes
  - removes www
  - alphabetically sorts query parameters
  - removes utm parameters
*/
export const Normalize = (input: string): string =>
  pipe(
    normalize(input),
    // Remove unecessary question mark
    url => (url = url.endsWith("?") ? url.slice(0, -1) : url)
  );

export const Format = (input: string) => input as T;

export const Is = Codec.is;
