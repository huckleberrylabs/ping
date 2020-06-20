import * as iots from "io-ts";
import {
  Event,
  NameSpaceCaseString,
  UUID,
  PersonName,
  EmailAddress,
} from "../../../values";
import { Command } from "../use-cases/register";

export const Name = "auth:event:account:registered" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      account: UUID.Codec,
      email: EmailAddress.Codec,
      name: PersonName.Codec,
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (account: UUID.T, command: Command.T): T => ({
  ...command,
  account,
  type: Name,
});

export const Is = Codec.is;
