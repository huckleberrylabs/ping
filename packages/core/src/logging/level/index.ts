import * as iots from "io-ts";
import { NameSpaceCaseString } from "../../values";

export const Name = "logging:value:level" as NameSpaceCaseString.T;

export const Codec = iots.union(
  [iots.literal("error"), iots.literal("debug"), iots.literal("info")],
  Name
);

export type T = iots.TypeOf<typeof Codec>;
