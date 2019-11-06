import * as iots from "io-ts";
import {
  UUID,
  NonEmptyString,
  PersonName,
  EmailAddress,
  OptionFromNullable,
} from "@huckleberryai/core";
import * as Event from "../../../event";
import { some, none } from "fp-ts/lib/Option";

export const Name = "ping:account:update";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      email: EmailAddress.Codec,
      userName: PersonName.Codec,
      billingEmail: OptionFromNullable.Codec(EmailAddress.Codec),
      name: OptionFromNullable.Codec(NonEmptyString.Codec),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  account: UUID.T,
  email: EmailAddress.T,
  userName: PersonName.T,
  billingEmail?: EmailAddress.T,
  name?: NonEmptyString.T,
  corr?: UUID.T
): T => ({
  ...Event.C(account, corr),
  type: Name,
  email,
  userName,
  billingEmail: billingEmail ? some(billingEmail) : none,
  name: name ? some(name) : none,
});

export const Is = Codec.is;
