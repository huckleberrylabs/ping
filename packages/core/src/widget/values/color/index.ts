import { NameSpaceCaseString, Color } from "../../../values";

export const Name = "widget:value:color" as NameSpaceCaseString.T;

export const Codec = Color.Codec;

export const DEFAULT = "#0B7DE5" as Color.T;

export type T = Color.T;

export const C = (v?: T): T => (v ? v : DEFAULT);

export const Is = Codec.is;
