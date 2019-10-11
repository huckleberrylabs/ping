import * as iots from "io-ts";
import * as KebabCaseString from "../kebab-case-string";
import uuid from "uuid/v4";

export interface Brand {
  readonly UUID: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
  "UUID"
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T => KebabCaseString.Is(input);

export const C = () => uuid() as T;
