import * as iots from "io-ts";
import { Type, Phone } from "@huckleberryai/core";
import { Event as Base } from "../base";
import * as Command from "./command";

export const Name = "widget:event:phone-added-to-message" as Type.T;

export const Codec = iots.intersection(
  [
    Base.Codec,
    iots.type({
      phone: Phone.Codec,
    }),
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (command: Command.T): T => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
