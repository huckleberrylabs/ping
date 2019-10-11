import { some, none } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import { optionFromNullable } from "@huckleberryai/core";
import { get } from "./helper";

export const DoNotTrackCodec = optionFromNullable(
  iots.union([
    iots.literal("1"),
    iots.literal("0"),
    iots.literal("unspecified"),
  ])
);

export type DoNotTrack = iots.TypeOf<typeof DoNotTrackCodec>;

export const GetDoNotTrack = () =>
  !window.navigator.doNotTrack
    ? none
    : (some(window.navigator.doNotTrack) as DoNotTrack);

export const AdBlocker = async (): Promise<boolean> => {
  try {
    await fetch(
      new Request(
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
        {
          method: "HEAD",
          mode: "no-cors",
        }
      )
    );
    return false;
  } catch (error) {
    return true;
  }
};

export const BrowserCodec = iots.type({
  app: iots.type({
    codeName: iots.string,
    name: iots.string,
    version: iots.string,
  }),
  buildID: optionFromNullable(iots.string),
  product: iots.string,
  productSub: iots.string,
  vendor: iots.string,
  vendorSub: iots.string,
  userAgent: iots.string,
  cookieEnabled: iots.boolean,
  doNotTrack: DoNotTrackCodec,
  javaEnabled: iots.boolean,
  plugins: iots.number,
  adBlocker: iots.boolean,
});

export type Browser = iots.TypeOf<typeof BrowserCodec>;

export const Browser = async (): Promise<Browser> => ({
  app: {
    codeName: window.navigator.appCodeName,
    name: window.navigator.appName,
    version: window.navigator.appVersion,
  },
  // @ts-ignore
  buildID: get(window.navigator.buildID),
  product: window.navigator.product,
  productSub: window.navigator.productSub,
  vendor: window.navigator.vendor,
  vendorSub: window.navigator.vendorSub,
  userAgent: window.navigator.userAgent,
  cookieEnabled: window.navigator.cookieEnabled,
  doNotTrack: GetDoNotTrack(),
  javaEnabled: window.navigator.javaEnabled(),
  plugins: window.navigator.plugins.length,
  adBlocker: await AdBlocker(),
});
