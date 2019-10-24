import * as iots from "io-ts";
import {
  UUID,
  Event,
  OptionFromNullable,
  NonEmptyString,
  PersonName,
} from "@huckleberryai/core";
import { some, none } from "fp-ts/lib/Option";

export const Name = "ping:register-account";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      stripeToken: NonEmptyString.Codec,
      userName: PersonName.Codec,
      email: NonEmptyString.Codec,
      billingEmail: OptionFromNullable.Codec(NonEmptyString.Codec),
      name: OptionFromNullable.Codec(NonEmptyString.Codec),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  stripeToken: NonEmptyString.T,
  userName: PersonName.T,
  email: NonEmptyString.T,
  billingEmail?: NonEmptyString.T,
  name?: NonEmptyString.T,
  corr?: UUID.T
): T => ({
  ...Event.C(corr),
  type: Name,
  stripeToken,
  userName,
  email,
  billingEmail: billingEmail ? some(billingEmail) : none,
  name: name ? some(name) : none,
});

export const Is = Codec.is;
