import { NameSpaceCaseString, WholeNumber } from "../../../values";

export const Name = "widget:value:offset" as NameSpaceCaseString.T;

export const Codec = WholeNumber.Codec;

export const DEFAULT = 20 as WholeNumber.T;

export type T = WholeNumber.T;

export const C = (v?: T): T => (v ? v : DEFAULT);

export const Is = Codec.is;
