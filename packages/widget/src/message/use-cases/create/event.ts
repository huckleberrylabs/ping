import * as iots from "io-ts";
import { Type } from "@huckleberryai/core";
import { MessageEventCodec } from "../base";
import { Command } from "./command";

export const EventType = "widget:event:message-created" as Type;

export const EventCodec = MessageEventCodec;

export type Event = iots.TypeOf<typeof EventCodec>;

export const Event = (command: Command) => ({
  ...command,
  type: EventType,
});
