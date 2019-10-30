import * as iots from "io-ts";
import {
  UUID,
  NonEmptyString,
  PersonName,
  OptionFromNullable,
} from "@huckleberryai/core";
import * as Event from "../../../event";
import { some, none } from "fp-ts/lib/Option";

export const Name = "ping:account:update";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      email: NonEmptyString.Codec,
      userName: PersonName.Codec,
      billingEmail: OptionFromNullable.Codec(iots.string),
      name: OptionFromNullable.Codec(NonEmptyString.Codec),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  account: UUID.T,
  email: NonEmptyString.T,
  userName: PersonName.T,
  billingEmail?: NonEmptyString.T,
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
