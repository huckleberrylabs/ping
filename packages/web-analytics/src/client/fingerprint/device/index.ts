import * as iots from "io-ts";
import { optionFromNullable } from "@huckleberryai/core";
import { get } from "../helper";
import * as GPU from "./gpu";
import * as Memory from "./memory";
import * as Battery from "./battery";
import * as Keyboard from "./keyboard";
import * as MediaDevices from "./media-devices";
import * as Fonts from "./fonts";

export { GPU, Memory, Battery, Keyboard, MediaDevices, Fonts };

export const Codec = iots.type({
  platform: optionFromNullable(iots.string),
  oscpu: optionFromNullable(iots.string),
  hardwareConcurrency: optionFromNullable(iots.number),
  maxTouchPoints: optionFromNullable(iots.number),
  screen: iots.type({
    width: iots.number,
    height: iots.number,
    colorDepth: iots.number,
  }),

  gpu: GPU.Codec,
  memory: Memory.Codec,
  battery: Battery.Codec,
  mediaDevices: MediaDevices.Codec,
  keyboard: Keyboard.Codec,
  fonts: Fonts.Codec,
});

export type Device = iots.TypeOf<typeof Codec>;

export const Detect = async (): Promise<Device> => ({
  platform: get(window.navigator.platform),
  oscpu: get(window.navigator.oscpu),
  hardwareConcurrency: get(window.navigator.hardwareConcurrency),
  maxTouchPoints: get(window.navigator.maxTouchPoints),
  screen: {
    width: window.screen.width * window.devicePixelRatio,
    height: window.screen.height * window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
  },

  gpu: await GPU.Detect(),
  memory: Memory.Detect(),
  battery: await Battery.Detect(),
  keyboard: await Keyboard.Detect(),
  mediaDevices: await MediaDevices.Detect(),
  fonts: Fonts.Detect(),
});
