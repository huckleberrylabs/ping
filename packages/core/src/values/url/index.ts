import { pipe } from "fp-ts/lib/pipeable";
import { tryCatch, isRight, map } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { URL } from "url";
import normalize from "normalize-url";
import * as Errors from "../../errors";

export const Name = "core:value:url";

export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => isRight(C(input)),
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (input: string) =>
  pipe(
    Parse(input),
    map(Normalize),
    map(Format)
  );

/* 
  - checks if valid
  - lowercases scheme and host
  - removes default port
*/
export const Parse = (input: string) =>
  tryCatch(() => new URL(input).toString(), () => Errors.Parsing.C());

/*
  - removes trailing slash
  - removes default directory indexes
  - removes www
  - alphabetically sorts query parameters
  - removes utm parameters
*/
export const Normalize = (input: string): string => {
  const url = normalize(input);
  // Remove trailing question mark
  return url.endsWith("?") ? url.slice(0, -1) : url;
};

export const Format = (input: string) => input as T;

export const Is = Codec.is;
