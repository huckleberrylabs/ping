import * as iots from "io-ts";

export const LogLevelCodec = iots.union([
  iots.literal("critical"),
  iots.literal("error"),
  iots.literal("debug"),
  iots.literal("info"),
]);

export type LogLevel = iots.TypeOf<typeof LogLevelCodec>;
