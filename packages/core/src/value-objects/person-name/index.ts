import { IsNonNullObject } from "../../helpers";
import { parseName } from "humanparser";
// Try parse-full-name as well if not working well

export interface IPersonName {
  original: string;
  legal: string | null;
  first: string | null;
  last: string | null;
  middle: string | null;
  prefix: string | null;
  suffix: string | null;
}

export type ISerializedPersonName = IPersonName;

/** Parses single string */
export const PersonName = (input: string): IPersonName => {
  if (typeof input !== "string" || input.trim().length < 2) {
    throw new Error(`PersonNameConstructor: string is not a valid name`);
  }
  const name = parseName(input);
  return {
    original: input,
    legal: null,
    first: name.firstName && name.firstName.length > 0 ? name.firstName : null,
    last: name.lastName && name.lastName.length > 0 ? name.lastName : null,
    middle: name.middleName ? name.middleName : null,
    prefix: name.salutation ? name.salutation : null,
    suffix: name.suffix ? name.suffix : null,
  };
};

const hasAllProperties = (input: object): boolean => {
  const hasOriginal = "original" in input;
  const hasLegal = "legal" in input;
  const hasFirst = "first" in input;
  const hasLast = "last" in input;
  const hasMiddle = "middle" in input;
  const hasPrefix = "prefix" in input;
  const hasSuffix = "suffix" in input;
  if (
    hasOriginal &&
    hasLegal &&
    hasFirst &&
    hasLast &&
    hasMiddle &&
    hasPrefix &&
    hasSuffix
  ) {
    return true;
  }
  return false;
};

export const IsPersonName = (input: unknown): input is IPersonName => {
  // Must be string
  if (!IsNonNullObject(input)) {
    return false;
  }
  if (!hasAllProperties(input)) {
    return false;
  }
  return true;
};

export const IsSerializedPersonName = (
  input: unknown
): input is ISerializedPersonName => {
  // Must be string
  if (!IsNonNullObject(input)) {
    return false;
  }
  if (!hasAllProperties(input)) {
    return false;
  }
  return true;
};

export const PersonNameSerializer = (
  input: IPersonName
): ISerializedPersonName => {
  if (IsPersonName(input)) {
    return input;
  }
  throw new Error("PersonNameSerializer: not a PersonName");
};

export const PersonNameDeserializer = (input: unknown): IPersonName => {
  if (IsSerializedPersonName(input)) {
    return input;
  }
  throw new Error("PersonNameDeserializer: not a ISerializedPersonName");
};
