import * as iots from "io-ts";
import { EmailAddress, Event } from "@huckleberryai/core";
import * as Command from "../command";

export const Name = "ping:account:login-email-sent";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      email: EmailAddress.Codec,
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
