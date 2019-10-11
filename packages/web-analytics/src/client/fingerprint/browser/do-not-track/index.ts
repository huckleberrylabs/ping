import { some, none } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import { optionFromNullable } from "@huckleberryai/core";

export const Codec = optionFromNullable(
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
