import fs from "fs";
import disposable from "disposable-email";
import freemail from "freemail";
import validator from "validator";

const genericAccountArray = fs
  .readFileSync("genericAccounts.txt")
  .toString()
  .split("\n");
const genericDomainArray = fs
  .readFileSync("genericDomains.txt")
  .toString()
  .split("\n");

export type EmailAddress = string;

export const ParseEmailAddress = (input: string): EmailAddress =>
  validator.normalizeEmail(input);

export const EmailIsValid = (input: string): EmailAddress =>
  validator.isEmail(input);

export const EmailAddressHasGenericUserName = (input: EmailAddress): boolean =>
  genericAccountArray.includes(input.split("@")[0]);

export const EmailAddressIsFromCommonProvider = (
  input: EmailAddress
): boolean =>
  genericDomainArray.includes(input.split("@")[1]) || freemail.isFree(input);

export const EmailAddressIsDisposable = (input: EmailAddress): boolean =>
  freemail.isDisposable(input) || disposable.validate(input);
