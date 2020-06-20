import * as iots from "io-ts";
import { NameSpaceCaseString } from "../../../values";

export const Name = "widget:value:icon" as NameSpaceCaseString.T;

export const Codec = iots.union([iots.literal(1), iots.literal(2)], Name);

export const DEFAULT: T = 1;

export type T = iots.TypeOf<typeof Codec>;

export const C = (v?: T): T => (v ? v : DEFAULT);

export const Is = Codec.is;
