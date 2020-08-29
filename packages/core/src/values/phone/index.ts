import * as iots from "io-ts";
import { Either, fold, left, right, isRight } from "fp-ts/lib/Either";
import { parsePhoneNumber, CountryCode } from "libphonenumber-js/max";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export const Name = "value:phone";
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
export const C = (
  input: string,
  country?: CountryCode
): Either<Errors.Validation.T, T> => {
  try {
    const parsed = parsePhoneNumber(input, country);
    if (!parsed.isPossible())
      return left(Errors.Validation.C(Name, `Constructor isPossible failed`));
    return right(parsed.format("E.164") as T);
  } catch (error) {
    return left(
      Errors.Validation.C(Name, `Constructor parsing error - ${error.message}`)
    );
  }
};
