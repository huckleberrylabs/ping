// @ts-ignore
import * as iots from "io-ts";
import * as Core from "@huckleberryai/core";
import * as WebAnalytics from "@huckleberryai/web-analytics";
import * as Widget from "@huckleberryai/widget";

export type Names = Core.Names | WebAnalytics.Names | Widget.Names;

export const Codecs = new Map([
  ...Array.from(Core.Codecs.entries()),
  ...Array.from(WebAnalytics.Codecs.entries()),
  ...Array.from(Widget.Codecs.entries()),
]);

export default Codecs;
