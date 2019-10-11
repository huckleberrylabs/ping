import * as iots from "io-ts";

export interface Brand {
  readonly NonEmptyString: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
  "NonEmptyString"
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T =>
  typeof input === "string" && input.length > 0;
