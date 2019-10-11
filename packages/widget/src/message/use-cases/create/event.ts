import * as iots from "io-ts";
import { Type } from "@huckleberryai/core";
import { Event as Base } from "../base";
import * as Command from "./command";

export const Name = "widget:event:message-created" as Type.T;

export const Codec = Base.Codec;

export type T = iots.TypeOf<typeof Codec>;

export const C = (command: Command.T) => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
