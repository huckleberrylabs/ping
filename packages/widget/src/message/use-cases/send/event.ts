import * as iots from "io-ts";
import { Type } from "@huckleberryai/core";
import { Command } from "./command";
import { MessageEventCodec } from "../base";

export const EventType = "widget:event:message-sent" as Type;

export const EventCodec = MessageEventCodec;

export type Event = iots.TypeOf<typeof EventCodec>;

export const Event = (command: Command) => ({
  ...command,
  type: EventType,
});
