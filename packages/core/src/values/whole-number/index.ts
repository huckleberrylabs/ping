import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export const Name = "value:whole-number";
export interface Brand {
  readonly [Name]: unique symbol;
}
export const Codec = iots.brand(
  iots.number,
  (input): input is iots.Branded<number, Brand> => Is(input),
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
export const Is = (input: unknown): input is T =>
  typeof input === "number" && input.valueOf() >= 0 && Number.isInteger(input);
export type T = iots.TypeOf<typeof Codec>;
