import Core from "@huckleberryai/core";
import WebAnalytics from "@huckleberryai/web-analytics";
import Widget from "@huckleberryai/widget";

export type Names = Core.Names | WebAnalytics.Names | Widget.Names;

export const Codecs = new Map([
  ...Array.from(Core.Codecs.entries()),
  ...Array.from(WebAnalytics.Codecs.entries()),
  ...Array.from(Widget.Codecs.entries()),
]);

export default Codecs;
