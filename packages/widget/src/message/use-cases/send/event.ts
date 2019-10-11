import * as iots from "io-ts";
import { Type } from "@huckleberryai/core";
import * as Command from "./command";
import { Event as Base } from "../base";

export const Name = "widget:event:message-sent" as Type.T;

export const Codec = Base.Codec;

export type T = iots.TypeOf<typeof Codec>;

export const C = (command: Command.T) => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
