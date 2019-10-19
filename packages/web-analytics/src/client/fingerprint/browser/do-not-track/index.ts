import { some, none } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import { OptionFromNullable } from "@huckleberryai/core";

export const Codec = OptionFromNullable.Codec(
  iots.union([
    iots.literal("1"),
    iots.literal("0"),
    iots.literal("unspecified"),
  ])
);

export type T = iots.TypeOf<typeof Codec>;

export const Detect = () =>
  !window.navigator.doNotTrack
    ? none
    : (some(window.navigator.doNotTrack) as T);
