import * as iots from "io-ts";
import * as NameSpaceCaseString from "../namespace-case-string";

export const Name = "value:country" as NameSpaceCaseString.T;

export const Countries = {
  CA: null,
  US: null,
};

export const DEFAULT = "CA";

export const Codec = iots.keyof(Countries, Name);

export type T = iots.TypeOf<typeof Codec>;

export const C = (v?: T): T => (v ? v : DEFAULT);

export const Is = Codec.is;
