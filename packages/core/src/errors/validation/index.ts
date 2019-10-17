import * as iots from "io-ts";
import * as Base from "../../error";
import { Type } from "../../values";

export const Name = "core:error:validation" as Type.T;
export const Codec = Base.Codec;
export type T = iots.TypeOf<typeof Codec>;
export const C = () => Base.C(Name);
export const Is = Codec.is;
