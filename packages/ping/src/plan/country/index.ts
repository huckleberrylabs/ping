import * as iots from "io-ts";

export const Name = "ping:country";

export const Codec = iots.union([iots.literal("CA"), iots.literal("US")], Name);

export const Is = Codec.is;

export type T = iots.TypeOf<typeof Codec>;
