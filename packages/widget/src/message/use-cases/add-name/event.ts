import * as iots from "io-ts";
import { Type, PersonNameCodec } from "@huckleberryai/core";
import { MessageEventCodec } from "../base";
import { Command } from "./command";

export const EventType = "widget:event:name-added-to-message" as Type;

export const EventCodec = iots.intersection(
  [
    MessageEventCodec,
    iots.type({
      name: PersonNameCodec,
    }),
  ],
  EventType
);

export type Event = iots.TypeOf<typeof EventCodec>;

export const Event = (command: Command) => ({
  ...command,
  type: EventType,
});
