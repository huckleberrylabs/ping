import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { NameSpaceCaseString, WholeNumber, Errors } from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "widget:value:offset" as NameSpaceCaseString.T;
export const Codec = WholeNumber.Codec;
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
export type T = WholeNumber.T;
export const DEFAULT = 20 as WholeNumber.T;
export const C = (v?: T): T => (v ? v : DEFAULT);
