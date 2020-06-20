import * as iots from "io-ts";
import { EmailAddress, Event, NameSpaceCaseString } from "../../../values";
import { Command } from "../use-cases/send-login-email";

export const Name = "auth:event:login-email-sent" as NameSpaceCaseString.T;

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
