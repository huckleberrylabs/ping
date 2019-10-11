import * as iots from "io-ts";
import { Type, PhoneCodec } from "@huckleberryai/core";
import { MessageEventCodec } from "../base";
import { Command } from "./command";

export const EventType = "widget:event:phone-added-to-message" as Type;

export const EventCodec = iots.intersection(
  [
    MessageEventCodec,
    iots.type({
      phone: PhoneCodec,
    }),
  ],
  EventType
);

export type Event = iots.TypeOf<typeof EventCodec>;

export const Event = (command: Command): Event => ({
  ...command,
  type: EventType,
});
