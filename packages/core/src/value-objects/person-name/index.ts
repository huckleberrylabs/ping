// Try parse-full-name as well if not working well
import { parseName } from "humanparser";
import { IsNonNullObject } from "../non-null-object";
import { IsNonEmptyString } from "../non-empty-string";

export type NameString = string | null;

export type PersonName = {
  parsed: NameString;
  legal: NameString;
  first: NameString;
  last: NameString;
  middle: NameString;
  prefix: NameString;
  suffix: NameString;
};

export const ParsePersonName = (input: string): PersonName => {
  const { firstName, lastName, middleName, salutation, suffix } = parseName(
    input
  );
  return {
    parsed: input,
    legal: null,
    first: firstName && firstName.length > 0 ? firstName : null,
    last: lastName && lastName.length > 0 ? lastName : null,
    middle: middleName && middleName.length > 0 ? middleName : null,
    prefix: salutation && salutation.length > 0 ? salutation : null,
    suffix: suffix && suffix.length > 0 ? suffix : null,
  };
};

export const IsValidNameString = (input: unknown): boolean =>
  typeof input === null || IsNonEmptyString(input);

export const IsPersonName = (input: unknown): input is PersonName =>
  IsNonNullObject(input) &&
  IsValidNameString(input.parsed) &&
  IsValidNameString(input.legal) &&
  IsValidNameString(input.first) &&
  IsValidNameString(input.last) &&
  IsValidNameString(input.middle) &&
  IsValidNameString(input.prefix) &&
  IsValidNameString(input.suffix);
