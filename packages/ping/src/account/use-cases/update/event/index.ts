import * as iots from "io-ts";
import {
  NonEmptyString,
  PersonName,
  OptionFromNullable,
} from "@huckleberryai/core";
import * as Event from "../../../event";
import * as Command from "../command";

export const Name = "ping:account:updated";

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

export const C = (command: Command.T): T => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
