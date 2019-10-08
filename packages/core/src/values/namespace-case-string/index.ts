import * as iots from "io-ts";
import { IsKebabCaseString } from "../kebab-case-string";
import { IsNonEmptyString } from "../non-empty-string";

export interface NameSpaceCaseStringBrand {
  readonly NameSpaceCaseString: unique symbol;
}

export const NameSpaceCaseStringCodec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, NameSpaceCaseStringBrand> =>
    IsNameSpaceCaseString(input),
  "NameSpaceCaseString"
);

export type NameSpaceCaseString = iots.TypeOf<typeof NameSpaceCaseStringCodec>;

export const IsNameSpaceCaseString = (
  input: unknown
): input is NameSpaceCaseString =>
  IsNonEmptyString(input) && input.split(":").every(IsKebabCaseString);
