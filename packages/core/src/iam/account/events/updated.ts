import * as iots from "io-ts";
import {
  PersonName,
  EmailAddress,
  Event,
  NameSpaceCaseString,
  UUID,
} from "../../../values";
import { Command } from "../use-cases/update";

export const Name = "auth:event:account:updated" as NameSpaceCaseString.T;

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

export const C = (command: Command.T): T => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
