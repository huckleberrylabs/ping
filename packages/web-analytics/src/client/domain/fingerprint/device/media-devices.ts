import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { optionFromNullable } from "@huckleberryai/core";

export const MediaDevicesCodec = optionFromNullable(
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

export type MediaDevices = iots.TypeOf<typeof MediaDevicesCodec>;

export const MediaDevices = async (): Promise<MediaDevices> => {
  if (
    window.navigator.mediaDevices &&
    window.navigator.mediaDevices.enumerateDevices
  )
    return some(await window.navigator.mediaDevices.enumerateDevices());
  return none;
};
