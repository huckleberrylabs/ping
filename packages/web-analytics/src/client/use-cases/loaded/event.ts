import * as iots from "io-ts";
import { Type } from "@huckleberryai/core";
import * as Base from "../../base";

export const Name = "web-analytics:event:client-loaded" as Type.T;
export const Codec = Base.Event.Codec;
export type T = iots.TypeOf<typeof Codec>;
export const C = Base.Event.C(Name);
