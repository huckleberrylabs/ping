import * as iots from "io-ts";

export const Codec = iots.union([
  iots.literal("critical"),
  iots.literal("error"),
  iots.literal("debug"),
  iots.literal("info"),
]);

export type T = iots.TypeOf<typeof Codec>;
