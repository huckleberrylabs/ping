import * as iots from "io-ts";
import * as NonEmptyString from "../non-empty-string";

export const Name = "value:kebab-case-string";

export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T =>
  NonEmptyString.Is(input) && /^([a-z0-9]+)(-[a-z0-9]+)*$/.test(input);
