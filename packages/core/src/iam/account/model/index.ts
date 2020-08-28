import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { some, none } from "fp-ts/lib/Option";
import {
  UUID,
  TimeStamp,
  PersonName,
  EmailAddress,
  NameSpaceCaseString,
  VerifiedEmailAddress,
  Errors,
  OptionFromNullable,
  NonEmptyString,
} from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "auth:model:account" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    type: iots.literal(Name),
    id: UUID.Codec,
    customer: NonEmptyString.Codec,
    registeredAt: TimeStamp.Codec,
    name: OptionFromNullable.Codec(PersonName.Codec),
    email: VerifiedEmailAddress.Codec,
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
  email: EmailAddress.T,
  customer: NonEmptyString.T,
  name?: PersonName.T
): T => ({
  type: Name,
  registeredAt: TimeStamp.C(),
  id: UUID.C(),
  email: VerifiedEmailAddress.C(email),
  customer,
  name: name ? some(name) : none,
});
