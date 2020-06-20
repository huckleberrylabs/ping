import * as iots from "io-ts";
import { Either, right, left, isRight } from "fp-ts/lib/Either";
import validator from "validator";
import * as Errors from "../errors";
import * as NonEmptyString from "../non-empty-string";
import { GenericDomains } from "./generic-domains";
import { DisposableDomains } from "./disposable-domains";
import { GenericAccounts } from "./generic-accounts";

export const Name = "value:email-address";
export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => isRight(C(input)),
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  input: string
): Either<Errors.Validation.T | Errors.Parsing.T, T> => {
  const isEmail = NonEmptyString.Is(input) && validator.isEmail(input);
  if (!isEmail) return left(Errors.Validation.C());
  const normalized = validator.normalizeEmail(input);
  if (!normalized) return left(Errors.Parsing.C());
  return right(normalized as T);
};

export const HasGenericUserName = (input: T): boolean =>
  GenericAccounts.includes(input.split("@")[0]);

export const IsFromCommonProvider = (input: T): boolean =>
  GenericDomains.includes(input.split("@")[1]);

export const IsDisposable = (input: T): boolean =>
  DisposableDomains.includes(input.split("@")[1]);

export const Is = Codec.is;
