import * as iots from "io-ts";
import { NameSpaceCaseString } from "../../../values";

export const Name = "widget:value:button-text" as NameSpaceCaseString.T;

export const Codec = iots.union(
  [iots.literal("ping"), iots.literal("ping-me"), iots.literal("ping-us")],
  Name
);

export const DEFAULT = "ping";

export type T = iots.TypeOf<typeof Codec>;

export const C = (v?: T): T => (v ? v : DEFAULT);

export const Is = Codec.is;
