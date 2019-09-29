import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { IsNonEmptyString } from "../non-empty-string";

export type Phone = string;

export const ParsePhone = (input: string): Phone => {
  const phone = parsePhoneNumberFromString(input);
  if (phone) return phone.format("E.164");
  throw new Error("phone input cannot be parsed");
};

export const IsPhoneValue = (input: unknown): input is Phone =>
  IsNonEmptyString(input) && IsPossiblePhone(input);

export const IsPossiblePhone = (input: string): input is Phone => {
  const phone = parsePhoneNumberFromString(input);
  return phone !== undefined && phone.isPossible();
};

export const IsValidPhone = (input: string): boolean => {
  const phone = parsePhoneNumberFromString(input);
  return phone !== undefined && phone.isValid();
};
