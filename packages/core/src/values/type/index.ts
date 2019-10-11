import * as iots from "io-ts";
import * as NameSpaceCaseString from "../namespace-case-string";

export interface Brand {
  readonly Type: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
  "Type"
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T => NameSpaceCaseString.Is(input);
