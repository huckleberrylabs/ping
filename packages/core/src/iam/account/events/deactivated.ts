import * as iots from "io-ts";
import { Event, NameSpaceCaseString, UUID } from "../../../values";
import { Command } from "../use-cases/deactivate";

export const Name = "auth:event:account:deactivated" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      account: UUID.Codec,
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
