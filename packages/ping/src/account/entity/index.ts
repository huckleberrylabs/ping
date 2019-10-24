import * as iots from "io-ts";
import {
  UUID,
  TimeStamp,
  NonEmptyString,
  OptionFromNullable,
  PersonName,
  Phone,
} from "@huckleberryai/core";
import * as Widget from "../../widget";
import { some, none, Option, isSome } from "fp-ts/lib/Option";

export const Name = "ping:account";

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    registeredAt: TimeStamp.Codec,
    id: UUID.Codec,
    stripeCustomerID: UUID.Codec,
    name: OptionFromNullable.Codec(NonEmptyString.Codec),
    userName: PersonName.Codec,
    email: iots.string,
    emailVerified: iots.boolean,
    billingEmail: OptionFromNullable.Codec(iots.string),
    billingEmailVerified: OptionFromNullable.Codec(iots.boolean),
    widgets: iots.array(Widget.Codec),
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  stripeCustomerID: UUID.T,
  userName: PersonName.T,
  email: NonEmptyString.T,
  billingEmail: Option<NonEmptyString.T>,
  name: Option<NonEmptyString.T>
): T => ({
  type: Name,
  registeredAt: TimeStamp.C(),
  id: UUID.C(),
  stripeCustomerID,
  name,
  userName,
  email,
  emailVerified: false,
  billingEmail,
  billingEmailVerified: isSome(billingEmail) ? some(false) : none,
  widgets: [],
});

export const Is = Codec.is;

export const PhoneExists = (account: T, phone: Phone.T) =>
  account.widgets.some(widget => widget.phone === phone);
