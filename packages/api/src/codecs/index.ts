// @ts-ignore
import * as iots from "io-ts";
import * as Core from "@huckleberryai/core";
import * as WebAnalytics from "@huckleberryai/web-analytics";
import * as Ping from "@huckleberryai/ping";

export type Names = Core.Names | WebAnalytics.Names | Ping.Names;

export const Codecs = new Map([
  ...Array.from(Core.Codecs.entries()),
  ...Array.from(WebAnalytics.Codecs.entries()),
  ...Array.from(Ping.Codecs.entries()),
]);

export default Codecs;
