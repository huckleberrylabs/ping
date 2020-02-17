import * as iots from "io-ts";
export const Name = "ping:value:icon";

export const Codec = iots.union([iots.literal(1), iots.literal(2)], Name);

export const Default: T = 1;

export type T = iots.TypeOf<typeof Codec>;

export const Is = Codec.is;
