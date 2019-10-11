import * as iots from "io-ts";
import * as Kebab from "../kebab-case-string";
import * as NonEmptyString from "../non-empty-string";

export interface Brand {
  readonly NameSpaceCaseString: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
  "NameSpaceCaseString"
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T =>
  NonEmptyString.Is(input) && input.split(":").every(Kebab.Is);
