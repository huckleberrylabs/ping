import * as iots from "io-ts";
import { NonEmptyString } from "..";

export const Name = "core:value:email-address";
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
  NonEmptyString.Is(input) && input.indexOf("@") > 0;
