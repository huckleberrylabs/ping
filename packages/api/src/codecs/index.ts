import * as iots from "io-ts";
import WebAnalytics from "@huckleberryai/web-analytics";
import { Type } from "@huckleberryai/core";

export type Name = typeof WebAnalytics.Client.UseCases.Loaded.Event.Name;

export const Codecs = new Map<Name | Type.T, iots.Mixed | null>([
  [
    WebAnalytics.Client.UseCases.Loaded.Event.Name,
    WebAnalytics.Client.UseCases.Loaded.Event.Codec,
  ],
]);

export default Codecs;
