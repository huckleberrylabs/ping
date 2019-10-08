import * as iots from "io-ts";
import { URL } from "url";
import normalize from "normalize-url";
import {
  tryCatch,
  isRight,
  Either,
  right,
  left,
  map,
  flatten,
} from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { ValidationError, ParsingError } from "../../errors";
import { IsNonEmptyString } from "../non-empty-string";

export interface UrlBrand {
  readonly Url: unique symbol;
}

export const UrlCodec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, UrlBrand> => isRight(Url(input)),
  "Url"
);

export type Url = iots.TypeOf<typeof UrlCodec>;

export const Url = (
  input: string
): Either<ValidationError | ParsingError, Url> =>
  pipe(
    IsNonEmptyString(input)
      ? right(input)
      : left(new ValidationError("cannot be empty")),
    map(ParseUrl),
    flatten,
    map(NormalizeUrl),
    map(FormatUrl)
  );

/* 
  - checks if valid
  - lowercases scheme and host
  - removes default port
*/
export const ParseUrl = (input: string) =>
  tryCatch(() => new URL(input).toString(), () => new ParsingError());

/*
  - removes trailing slash
  - removes default directory indexes
  - removes www
  - alphabetically sorts query parameters
  - removes utm parameters
*/
export const NormalizeUrl = (input: string): string =>
  pipe(
    normalize(input),
    // Remove unecessary question mark
    url => (url = url.endsWith("?") ? url.slice(0, -1) : url)
  );

export const FormatUrl = (input: string) => input as Url;
