import * as iots from "io-ts";
import { NameSpaceCaseString } from "../../../values";

export const Name = "widget:value:animation" as NameSpaceCaseString.T;

export const Codec = iots.union(
  [
    iots.literal("wiggle"),
    iots.literal("pulse"),
    iots.literal("jolt"),
    iots.literal("none"),
  ],
  Name
);

export const DEFAULT = "none";

export type T = iots.TypeOf<typeof Codec>;

export const C = (v?: T): T => (v ? v : DEFAULT);

export const Is = Codec.is;
