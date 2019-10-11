import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { optionFromNullable } from "@huckleberryai/core";

export const BatteryManagerCodec = optionFromNullable(
  iots.type({
    charging: iots.boolean,
    chargingTime: iots.number,
    dischargingTime: iots.number,
    level: iots.number,
  })
);
export type BatteryManager = iots.TypeOf<typeof BatteryManagerCodec>;

export const BatteryManager = async (): Promise<BatteryManager> => {
  // @ts-ignore
  if (!window.navigator.getBattery) return none;
  // @ts-ignore
  return some(await window.navigator.getBattery());
};
