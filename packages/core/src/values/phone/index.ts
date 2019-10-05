import { Either, right, left } from "fp-ts/lib/Either";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { IsNonEmptyString } from "../non-empty-string";

export type Phone = string;

export const ParsePhone = (input: string): Either<Error, Phone> => {
  const phone = parsePhoneNumberFromString(input);
  if (phone) return right(phone.format("E.164"));
  return left(new Error("phone input cannot be parsed"));
};

export const IsPhone = (input: unknown): input is Phone =>
  IsNonEmptyString(input) && IsPossiblePhone(input);

export const IsPossiblePhone = (input: string): input is Phone => {
  const phone = parsePhoneNumberFromString(input);
  return phone !== undefined && phone.isPossible();
};

export const IsValidPhone = (input: string): boolean => {
  const phone = parsePhoneNumberFromString(input);
  return phone !== undefined && phone.isValid();
};
