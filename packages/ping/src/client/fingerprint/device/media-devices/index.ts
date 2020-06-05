import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { OptionFromNullable } from "@huckleberrylabs/core";

export const Codec = OptionFromNullable.Codec(
  iots.array(
    iots.type({
      deviceId: iots.string,
      groupId: iots.string,
      kind: iots.union([
        iots.literal("audioinput"),
        iots.literal("audiooutput"),
        iots.literal("videoinput"),
      ]),
      label: iots.string,
    })
  )
);

export type T = iots.TypeOf<typeof Codec>;

export const Detect = async (): Promise<T> => {
  if (
    window.navigator.mediaDevices &&
    window.navigator.mediaDevices.enumerateDevices
  )
    return some(await window.navigator.mediaDevices.enumerateDevices());
  return none;
};
