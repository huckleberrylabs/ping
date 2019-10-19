import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { OptionFromNullable } from "@huckleberryai/core";

export const Codec = OptionFromNullable.Codec(
  iots.type({
    vendor: iots.string,
    renderer: iots.string,
  })
);
export type T = iots.TypeOf<typeof Codec>;

// https://gist.github.com/cvan/042b2448fcecefafbb6a91469484cdf8
export const Detect = async (): Promise<T> => {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      // @ts-ignore
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        // @ts-ignore
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        // @ts-ignore
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return some({ vendor, renderer });
      }
    }
  } catch (e) {}
  return none;
};
