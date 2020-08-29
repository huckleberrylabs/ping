import * as iots from "io-ts";
import { Either, fold, left, right, isLeft } from "fp-ts/lib/Either";
import * as NameSpaceCaseString from "../namespace-case-string";
import * as Phone from "../phone";
import * as Country from "../country";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export const Name = "value:phone-with-county" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    country: Country.Codec,
    number: Phone.Codec,
  },
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
  phone: string,
  country: Country.T
): Either<Errors.Validation.T, T> => {
  const phoneMaybe = Phone.C(phone, country);
  if (isLeft(phoneMaybe)) return phoneMaybe;
  return right({
    number: phoneMaybe.right,
    country,
  });
};
