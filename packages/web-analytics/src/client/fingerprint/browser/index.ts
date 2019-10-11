import * as iots from "io-ts";
import { optionFromNullable } from "@huckleberryai/core";
import { get } from "../helper";
import * as DoNotTrack from "./do-not-track";
import * as AdBlocker from "./ad-blocker";

export { DoNotTrack, AdBlocker };

export const Codec = iots.type({
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
  javaEnabled: iots.boolean,
  plugins: iots.number,
  doNotTrack: DoNotTrack.Codec,
  adBlocker: iots.boolean,
});

export type T = iots.TypeOf<typeof Codec>;

export const Detect = async (): Promise<T> => ({
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
  javaEnabled: window.navigator.javaEnabled(),
  plugins: window.navigator.plugins.length,
  doNotTrack: DoNotTrack.Detect(),
  adBlocker: await AdBlocker.Detect(),
});
