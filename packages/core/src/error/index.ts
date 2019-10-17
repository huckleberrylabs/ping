import * as iots from "io-ts";
import * as Base from "../event";

export const Codec = Base.Codec;

export type T = iots.TypeOf<typeof Codec>;

export const C = Base.C;
