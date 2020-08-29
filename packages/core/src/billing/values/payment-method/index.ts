import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { NameSpaceCaseString, Errors, NonEmptyString } from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "model:billing:payment-method" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    last4: NonEmptyString.Codec,
    brand: NonEmptyString.Codec,
  },
  Name
);
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
export const C = (brand: NonEmptyString.T, last4: NonEmptyString.T): T => ({
  brand,
  last4,
});
