import * as iots from "io-ts";
import { Phone } from "@huckleberryai/core";
import { Event } from "../base";
import * as Command from "./command";

export const Name = "widget:message:phone-added";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      phone: Phone.Codec,
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
