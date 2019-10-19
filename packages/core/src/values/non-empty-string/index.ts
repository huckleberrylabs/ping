import * as iots from "io-ts";

export const Name = "core:value:non-empty-string";
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
  typeof input === "string" && input.length > 0;
