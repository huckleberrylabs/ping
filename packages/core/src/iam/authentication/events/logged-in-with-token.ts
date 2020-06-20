import * as iots from "io-ts";
import { Event, NonEmptyString, NameSpaceCaseString } from "../../../values";
import { Command } from "../use-cases/login-with-token";

export const Name = "auth:event:logged-in-with-token" as NameSpaceCaseString.T;

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      token: NonEmptyString.Codec,
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
