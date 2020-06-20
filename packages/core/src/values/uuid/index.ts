import * as iots from "io-ts";
import uuid from "uuid/v4";
import * as KebabCaseString from "../kebab-case-string";

export const Name = "value:uuid";

export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T => KebabCaseString.Is(input);

export const C = () => uuid() as T;
