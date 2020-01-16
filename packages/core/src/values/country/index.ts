import * as iots from "io-ts";

export const Name = "core:value:country";

export const Codec = iots.union(
  [iots.literal("CA"), iots.literal("US"), iots.literal("GB")],
  Name
);

export const Is = Codec.is;

export type T = iots.TypeOf<typeof Codec>;
