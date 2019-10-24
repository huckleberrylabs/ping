import * as iots from "io-ts";
import {
  Event,
  NonEmptyString,
  PersonName,
  OptionFromNullable,
} from "@huckleberryai/core";
import * as Command from "../command";

export const Name = "ping:account-registered";

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

export const C = (command: Command.T): T => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
