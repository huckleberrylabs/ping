import * as iots from "io-ts";
import { IsNonEmptyString } from "../non-empty-string";

export interface KebabCaseStringBrand {
  readonly KebabCaseString: unique symbol;
}

export const KebabCaseStringCodec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, KebabCaseStringBrand> =>
    IsKebabCaseString(input),
  "KebabCaseString"
);

export type KebabCaseString = iots.TypeOf<typeof KebabCaseStringCodec>;

export const IsKebabCaseString = (input: unknown): input is KebabCaseString =>
  IsNonEmptyString(input) && /^([a-z0-9]+)(-[a-z0-9]+)*$/.test(input);
