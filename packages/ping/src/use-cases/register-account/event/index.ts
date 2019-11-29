import * as iots from "io-ts";
import {
  Event,
  NonEmptyString,
  PersonName,
  EmailAddress,
  OptionFromNullable,
} from "@huckleberryai/core";
import * as PromoCode from "../../../promo-code";
import * as Command from "../command";

export const Name = "ping:account-registered";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      paymentMethod: NonEmptyString.Codec,
      email: EmailAddress.Codec,
      userName: PersonName.Codec,
      billingEmail: OptionFromNullable.Codec(EmailAddress.Codec),
      name: OptionFromNullable.Codec(NonEmptyString.Codec),
      promoCode: OptionFromNullable.Codec(PromoCode.Codec),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (command: Command.T): T => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
