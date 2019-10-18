import * as iots from "io-ts";
import { OptionFromNullable } from "@huckleberryai/core";
import * as Info from "./info";
import * as LocalIP from "./local-ip";

export const Codec = iots.type({
  info: OptionFromNullable.Codec(Info.Codec),
  localIP: OptionFromNullable.Codec(iots.string),
});

export type T = iots.TypeOf<typeof Codec>;

export const Detect = async () => ({
  info: Info.Detect(),
  localIP: await LocalIP.Detect(),
});
