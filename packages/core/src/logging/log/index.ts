import * as iots from "io-ts";
import * as Event from "../event";
import { NameSpaceCaseString } from "../../values";

export const Name = "logging:model:log" as NameSpaceCaseString.T;

export const Codec = iots.array(Event.Codec, Name);

export type T = iots.TypeOf<typeof Codec>;

export const C = (): T => [];
