import { Color } from "../../../values";

export const Name = Color.Name;
export const Codec = Color.Codec;
export const Decode = Color.Decode;
export const Encode = Color.Encode;
export const Is = Color.Is;
export const DEFAULT = "#0B7DE5" as Color.T;
export type T = Color.T;
export const C = (v?: T): T => (v ? v : DEFAULT);
