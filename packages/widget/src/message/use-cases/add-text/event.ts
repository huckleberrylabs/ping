import * as iots from "io-ts";
import { Type, NonEmptyString } from "@huckleberryai/core";
import { Event as Base } from "../base";
import * as Command from "./command";

export const Name = "widget:event:text-added-to-message" as Type.T;

export const Codec = iots.intersection(
  [
    Base.Codec,
    iots.type({
      text: NonEmptyString.Codec,
    }),
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (command: Command.T) => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
