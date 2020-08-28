import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import {
  UUID,
  NameSpaceCaseString,
  PersonName,
  TimeStamp,
  OptionFromNullable,
  PhoneWithCountry,
  Errors,
} from "../../../values";
import { some, none } from "fp-ts/lib/Option";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "messaging:model:contact" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    type: iots.literal(Name),
    id: UUID.Codec,
    created: TimeStamp.Codec,
    account: UUID.Codec,
    phone: PhoneWithCountry.Codec,
    name: OptionFromNullable.Codec(PersonName.Codec),
    internal: iots.boolean,
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
export const C = (
  account: UUID.T,
  internal: boolean,
  phone: PhoneWithCountry.T,
  name?: PersonName.T
): T => ({
  type: Name,
  id: UUID.C(),
  created: TimeStamp.C(),
  account,
  internal,
  phone,
  name: name ? some(name) : none,
});
