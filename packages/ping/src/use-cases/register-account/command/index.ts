import * as iots from "io-ts";
import {
  UUID,
  Event,
  OptionFromNullable,
  EmailAddress,
  NonEmptyString,
  PersonName,
} from "@huckleberryai/core";
import { some, none } from "fp-ts/lib/Option";

export const Name = "ping:register-account";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      paymentMethod: NonEmptyString.Codec,
      userName: PersonName.Codec,
      email: EmailAddress.Codec,
      billingEmail: OptionFromNullable.Codec(EmailAddress.Codec),
      name: OptionFromNullable.Codec(NonEmptyString.Codec),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  paymentMethod: NonEmptyString.T,
  email: EmailAddress.T,
  userName: PersonName.T,
  billingEmail?: EmailAddress.T,
  name?: NonEmptyString.T,
  corr?: UUID.T
): T => ({
  ...Event.C(corr),
  type: Name,
  paymentMethod,
  email,
  userName,
  billingEmail: billingEmail ? some(billingEmail) : none,
  name: name ? some(name) : none,
});

export const Is = Codec.is;
