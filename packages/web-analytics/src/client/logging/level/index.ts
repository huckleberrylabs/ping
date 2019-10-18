import * as iots from "io-ts";

export const Name = "web-analytics:client:log-level";

export const Codec = iots.union(
  [
    iots.literal("critical"),
    iots.literal("error"),
    iots.literal("debug"),
    iots.literal("info"),
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;
