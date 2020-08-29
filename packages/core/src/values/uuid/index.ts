import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import uuid from "uuid/v4";
import * as KebabCaseString from "../kebab-case-string";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export const Name = "value:uuid";
export interface Brand {
  readonly [Name]: unique symbol;
}
export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
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
export const Is = (input: unknown): input is T => KebabCaseString.Is(input);
export type T = iots.TypeOf<typeof Codec>;
export const C = () => uuid() as T;
