import * as iots from "io-ts";
import { Event, NameSpaceCaseString } from "../../../values";
import { Command } from "../use-cases/logout";

export const Name = "auth:event:logged-out" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
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
