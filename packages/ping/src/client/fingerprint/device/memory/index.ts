import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { OptionFromNullable } from "@huckleberrylabs/core";

export const Codec = OptionFromNullable.Codec(iots.number);

export type T = iots.TypeOf<typeof Codec>;

export const Detect = (): T =>
  // @ts-ignore
  window.navigator.deviceMemory ? some(window.navigator.deviceMemory) : none;