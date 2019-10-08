import * as iots from "io-ts";
import { NonEmptyString } from "io-ts-types/lib/NonEmptyString";

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
  NonEmptyString.is(input) && /^([a-z0-9]+)(-[a-z0-9]+)*$/.test(input);
