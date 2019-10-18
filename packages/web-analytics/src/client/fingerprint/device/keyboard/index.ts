import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { OptionFromNullable } from "@huckleberryai/core";

export const RecordCodec = iots.record(iots.string, iots.string);
export type Record = iots.TypeOf<typeof RecordCodec>;

export const Codec = OptionFromNullable.Codec(RecordCodec);

export type T = iots.TypeOf<typeof Codec>;

export const Detect = async (): Promise<T> => {
  // @ts-ignore
  if (!window.navigator.keyboard) return none;
  // @ts-ignore
  const map = await window.navigator.keyboard.getLayoutMap();
  const result: Record = {};
  (map as Map<string, string>).forEach((value, key) => {
    result[key] = value;
  });
  return some(result);
};
