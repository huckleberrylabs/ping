import * as iots from "io-ts";
import { some, none } from "fp-ts/lib/Option";

export const Codec = iots.type({
  downlink: iots.number,
  effectiveType: iots.string,
  rtt: iots.number,
  saveData: iots.boolean,
});
export type T = iots.TypeOf<typeof Codec>;

export const Detect = () => {
  //@ts-ignore
  if (!window.navigator.connection) none;
  //@ts-ignore
  return some(window.navigator.connection);
};
