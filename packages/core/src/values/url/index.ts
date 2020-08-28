import { pipe } from "fp-ts/lib/pipeable";
import {
  Either,
  fold,
  left,
  right,
  tryCatch,
  isRight,
  map,
} from "fp-ts/lib/Either";
import * as iots from "io-ts";
import normalize from "normalize-url";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

/*

Future Improvements

- replace ip with domain name

- replace http with https

- remove query option

- remove hash option

- intelligent option: check if urls resolve identically

- url aliases

- capitalize letters in escaped sequences

- decode unecessarly encoded characters

https://www.w3.org/International/articles/idn-and-iri/

encodeURIComponent(decodeURIComponent());

*/

export const Name = "value:url";
export interface Brand {
  readonly [Name]: unique symbol;
}
export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => isRight(C(input)),
  Name
);
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export const Is = Codec.is;
export type T = iots.TypeOf<typeof Codec>;
export const C = (input: string) =>
  pipe(Parse(input), map(Normalize), map(Format));
/* 
  - checks if valid
  - lowercases scheme and host
  - removes default port
*/
export const Parse = (input: string) =>
  tryCatch(
    () => new URL(input).toString(),
    () => Errors.Validation.C(Name, "Parse")
  );
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
