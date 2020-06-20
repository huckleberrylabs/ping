import * as iots from "io-ts";

export const Name = "value:whole-number";

export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.number,
  (input): input is iots.Branded<number, Brand> => Is(input),
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T =>
  typeof input === "number" && input.valueOf() >= 0 && Number.isInteger(input);
