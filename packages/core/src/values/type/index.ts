import * as iots from "io-ts";
import { IsNameSpaceCaseString } from "../namespace-case-string";

export interface TypeBrand {
  readonly Type: unique symbol;
}

export const TypeCodec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, TypeBrand> => IsType(input),
  "Type"
);

export type Type = iots.TypeOf<typeof TypeCodec>;

export const IsType = (input: unknown): input is Type =>
  IsNameSpaceCaseString(input);
