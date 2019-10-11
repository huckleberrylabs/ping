import * as iots from "io-ts";
import { LIST } from "./list";

type BaseFont = {
  family: string;
  width: number;
  height: number;
};

export { LIST };

export const Codec = iots.record(iots.string, iots.boolean);
export type T = iots.TypeOf<typeof Codec>;

// http://www.lalit.org/lab/javascript-css-font-detect/
export const Detect = (): T => {
  const testString = "mmmmmmmmmmlli";
  const testSize = "72px";
  const body = document.getElementsByTagName("body")[0];
  const span = document.createElement("span");
  span.style.fontSize = testSize;
  span.innerHTML = testString;

  const baseFontFamilies = ["monospace", "sans-serif", "serif"];
  const baseFonts: BaseFont[] = baseFontFamilies.map(family => {
    span.style.fontFamily = family;
    body.appendChild(span);
    const width = span.offsetWidth;
    const height = span.offsetHeight;
    body.removeChild(span);
    return {
      family,
      width,
      height,
    };
  });

  const detect = (font: string): boolean =>
    baseFonts
      .map(baseFont => {
        span.style.fontFamily = font + "," + baseFont.family;
        body.appendChild(span);
        const matched =
          span.offsetWidth != baseFont.width ||
          span.offsetHeight != baseFont.height;
        body.removeChild(span);
        return matched;
      })
      .reduce((detected, matched) => (detected = detected || matched), false);

  return LIST.sort(() => 0.5 - Math.random())
    .slice(0, 100)
    .map(font => ({
      family: font.family,
      detected: detect(font.family),
    }))
    .reduce((prev: T, curr) => {
      const next = { ...prev };
      next.family = curr.detected;
      return next;
    }, {});
};
