import * as iots from "io-ts";
import * as Event from "../event";

export const Name = "web-analytics:client:log";

export const Codec = iots.array(Event.Codec, Name);

export type T = iots.TypeOf<typeof Codec>;

export const C = (): T => [];
