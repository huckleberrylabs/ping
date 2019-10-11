import * as iots from "io-ts";
import { Type } from "@huckleberryai/core";
import { ClientEvent, ClientEventCodec } from "../../base";

export const EventType = "web-analytics:event:client-loaded" as Type;

export const EventCodec = ClientEventCodec;

export type Event = iots.TypeOf<typeof EventCodec>;

export const Event = ClientEvent(EventType);
