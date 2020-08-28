import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import * as NameSpaceCaseString from "../namespace-case-string";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export const Name = "value:country" as NameSpaceCaseString.T;
export const Countries = {
  CA: null,
  US: null,
};
export const DEFAULT = "CA";
export const Codec = iots.keyof(Countries, Name);
export const Is = Codec.is;
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export type T = iots.TypeOf<typeof Codec>;
export const C = (v?: T): T => (v ? v : DEFAULT);
