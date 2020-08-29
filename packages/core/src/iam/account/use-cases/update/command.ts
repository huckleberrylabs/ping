import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import {
  UUID,
  Event,
  PersonName,
  EmailAddress,
  NameSpaceCaseString,
  Errors,
} from "../../../../values";
import { DecodeErrorFormatter } from "../../../../logging";

export const Name = "auth:command:account:update" as NameSpaceCaseString.T;
export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      account: UUID.Codec,
      email: EmailAddress.Codec,
      name: PersonName.Codec,
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
  account: UUID.T,
  email: EmailAddress.T,
  name: PersonName.T
): T => ({
  ...Event.C(),
  type: Name,
  account,
  email,
  name,
});
