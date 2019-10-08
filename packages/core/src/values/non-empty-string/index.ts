import * as iots from "io-ts";

export interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol;
}

export const NonEmptyStringCodec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, NonEmptyStringBrand> =>
    IsNonEmptyString(input),
  "NonEmptyString"
);

export type NonEmptyString = iots.TypeOf<typeof NonEmptyStringCodec>;

export const IsNonEmptyString = (input: unknown): input is NonEmptyString =>
  typeof input === "string" && input.length > 0;
