import * as iots from "io-ts";
import { none, some } from "fp-ts/lib/Option";
import { optionFromNullable } from "@huckleberryai/core";

export const GPUCodec = optionFromNullable(
  iots.type({
    vendor: iots.string,
    renderer: iots.string,
  })
);
export type GPU = iots.TypeOf<typeof GPUCodec>;

// https://gist.github.com/cvan/042b2448fcecefafbb6a91469484cdf8
export const GPU = async (): Promise<GPU> => {
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
