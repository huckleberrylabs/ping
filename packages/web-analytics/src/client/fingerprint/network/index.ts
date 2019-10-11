import * as iots from "io-ts";
import { optionFromNullable } from "@huckleberryai/core";
import * as Info from "./info";
import * as LocalIP from "./local-ip";

export const Codec = iots.type({
  info: optionFromNullable(Info.Codec),
  localIP: optionFromNullable(iots.string),
});

export type T = iots.TypeOf<typeof Codec>;

export const Detect = async () => ({
  info: Info.Detect(),
  localIP: await LocalIP.Detect(),
});
