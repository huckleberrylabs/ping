/*
Useful Libs

https://www.npmjs.com/package/google-libphonenumber
https://www.npmjs.com/package/libphonenumber-js
https://www.npmjs.com/package/awesome-phonenumber

Enrich
- Carrier
- Line Type
- Location
- Timezone
- SMS Gateway Address
- Owner Name, Age, Email, etc
*/

import { parsePhoneNumberFromString, PhoneNumber } from "libphonenumber-js/max";
import { IsNonNullObject } from "../../helpers";

export interface IPhone extends PhoneNumber {}

export type ISerializedPhone = string;

/** Accepts phone string as input. */
export const Phone = (input: string): IPhone => {
  if (!IsSerializedPhone(input)) {
    throw new Error(`PhoneConstructor: string is not a valid phone number`);
  }
  const phone = parsePhoneNumberFromString(input);
  if (phone) {
    return phone;
  }
  throw new Error("Inpossible Error: IsSerializedPhone should prevent this");
};

export const IsPhone = (input: unknown): input is IPhone => {
  // Must be string
  if (!IsNonNullObject(input)) {
    return false;
  }
  const hasNumber = "number" in input;
  const hasCountryCallingCode = "countryCallingCode" in input;
  const hasNationalNumber = "nationalNumber" in input;
  const hasIsValid = "isValid" in input;
  const hasIsPossible = "isPossible" in input;
  const hasGetURI = "getURI" in input;
  const hasGetType = "getType" in input;
  const hasFormat = "format" in input;

  if (
    !hasNumber ||
    !hasCountryCallingCode ||
    !hasNationalNumber ||
    !hasIsValid ||
    !hasIsPossible ||
    !hasGetURI ||
    !hasGetType ||
    !hasFormat
  ) {
    return false;
  }
  if (!(<IPhone>input).isPossible()) {
    return false;
  }
  return true;
};

export const IsSerializedPhone = (
  input: unknown
): input is ISerializedPhone => {
  if (typeof input !== "string") {
    return false;
  }
  const phone = parsePhoneNumberFromString(input);
  if (!phone) {
    return false;
  }
  if (!phone.isPossible()) {
    return false;
  }
  return true;
};

export const PhoneSerializer = (input: IPhone): ISerializedPhone => {
  if (IsPhone(input)) {
    return input.format("E.164");
  }
  throw new Error("PhoneSerializer: not a Phone");
};

export const PhoneDeserializer = (input: unknown): IPhone => {
  if (IsSerializedPhone(input)) {
    return Phone(input);
  }
  throw new Error("PhoneDeserializer: not a ISerializedPhone");
};
