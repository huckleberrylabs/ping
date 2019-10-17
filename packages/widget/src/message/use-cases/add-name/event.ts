import * as iots from "io-ts";
import { Type, PersonName } from "@huckleberryai/core";
import { Event as Base } from "../base";
import * as Command from "./command";

export const Name = "widget:event:name-added-to-message" as Type.T;

export const Codec = iots.intersection([
  Base.Codec,
  iots.type({
    name: PersonName.Codec,
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (command: Command.T): T => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
