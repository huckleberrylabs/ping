import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { some, none } from "fp-ts/lib/Option";
import {
  Event,
  EmailAddress,
  NameSpaceCaseString,
  Errors,
  Url,
  PhoneWithCountry,
  OptionFromNullable,
} from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";
import { PromoCode } from "../../../billing/values";

export const Name = "customers:command:register" as NameSpaceCaseString.T;
export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      website: Url.Codec,
      phone: PhoneWithCountry.Codec,
      email: EmailAddress.Codec,
      promoCode: OptionFromNullable.Codec(PromoCode.Codec),
    }),
    Event.Codec,
  ],
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
export const C = (
  website: Url.T,
  phone: PhoneWithCountry.T,
  email: EmailAddress.T,
  promoCode?: PromoCode.T
): T => ({
  ...Event.C(),
  type: Name,
  website,
  phone,
  email,
  promoCode: promoCode ? some(promoCode) : none,
});
