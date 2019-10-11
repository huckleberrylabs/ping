import * as iots from "io-ts";
import * as Event from "../event";

export const Codec = iots.array(Event.Codec);

export type T = iots.TypeOf<typeof Codec>;

export const C = (): T => [];
