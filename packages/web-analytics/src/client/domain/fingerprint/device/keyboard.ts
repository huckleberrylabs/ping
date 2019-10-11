import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { optionFromNullable } from "@huckleberryai/core";

export const KeyboardRecordCodec = iots.record(iots.string, iots.string);
export type KeyboardRecord = iots.TypeOf<typeof KeyboardRecordCodec>;

export const KeyboardCodec = optionFromNullable(KeyboardRecordCodec);

export type Keyboard = iots.TypeOf<typeof KeyboardCodec>;

export const Keyboard = async (): Promise<Keyboard> => {
  // @ts-ignore
  if (!window.navigator.keyboard) return none;
  // @ts-ignore
  const map = await window.navigator.keyboard.getLayoutMap();
  const result: KeyboardRecord = {};
  (map as Map<string, string>).forEach((value, key) => {
    result[key] = value;
  });
  return some(result);
};
