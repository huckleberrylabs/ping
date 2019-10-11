import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { optionFromNullable } from "@huckleberryai/core";

export const MemoryCodec = optionFromNullable(iots.number);

export type Memory = iots.TypeOf<typeof MemoryCodec>;

export const Memory = (): Memory =>
  // @ts-ignore
  window.navigator.deviceMemory ? some(window.navigator.deviceMemory) : none;
