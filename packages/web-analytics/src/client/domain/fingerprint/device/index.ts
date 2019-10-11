import * as iots from "io-ts";
import { optionFromNullable } from "@huckleberryai/core";
import { get } from "../helper";
import { GPU, GPUCodec } from "./gpu";
import { Memory, MemoryCodec } from "./memory";
import { BatteryManager, BatteryManagerCodec } from "./battery";
import { Keyboard, KeyboardCodec } from "./keyboard";
import { MediaDevices, MediaDevicesCodec } from "./media-devices";
import { FontsCodec, Fonts } from "./fonts";

export const DeviceCodec = iots.type({
  platform: optionFromNullable(iots.string),
  oscpu: optionFromNullable(iots.string),
  hardwareConcurrency: optionFromNullable(iots.number),
  maxTouchPoints: optionFromNullable(iots.number),
  screen: iots.type({
    width: iots.number,
    height: iots.number,
    colorDepth: iots.number,
  }),

  gpu: GPUCodec,
  memory: MemoryCodec,
  battery: BatteryManagerCodec,
  mediaDevices: MediaDevicesCodec,
  keyboard: KeyboardCodec,
  fonts: FontsCodec,
});

export type Device = iots.TypeOf<typeof DeviceCodec>;

export const Device = async (): Promise<Device> => ({
  platform: get(window.navigator.platform),
  oscpu: get(window.navigator.oscpu),
  hardwareConcurrency: get(window.navigator.hardwareConcurrency),
  maxTouchPoints: get(window.navigator.maxTouchPoints),
  screen: {
    width: window.screen.width * window.devicePixelRatio,
    height: window.screen.height * window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
  },

  gpu: await GPU(),
  memory: Memory(),
  battery: await BatteryManager(),
  keyboard: await Keyboard(),
  mediaDevices: await MediaDevices(),
  fonts: Fonts(),
});
