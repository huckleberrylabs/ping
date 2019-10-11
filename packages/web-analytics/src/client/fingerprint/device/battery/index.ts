import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { optionFromNullable } from "@huckleberryai/core";

export const Codec = optionFromNullable(
  iots.type({
    charging: iots.boolean,
    chargingTime: iots.number,
    dischargingTime: iots.number,
    level: iots.number,
  })
);
export type T = iots.TypeOf<typeof Codec>;

export const Detect = async (): Promise<T> => {
  // @ts-ignore
  if (!window.navigator.getBattery) return none;
  // @ts-ignore
  return some(await window.navigator.getBattery());
};
