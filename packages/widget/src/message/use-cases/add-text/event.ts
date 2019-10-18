import * as iots from "io-ts";
import { NonEmptyString } from "@huckleberryai/core";
import { Event } from "../base";
import * as Command from "./command";

export const Name = "widget:message:text-added";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      text: NonEmptyString.Codec,
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
