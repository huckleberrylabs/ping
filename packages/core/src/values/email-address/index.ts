import * as iots from "io-ts";
import { Either, fold, left, right, isRight } from "fp-ts/lib/Either";
import validator from "validator";
import * as Errors from "../errors";
import * as NonEmptyString from "../non-empty-string";
import { DecodeErrorFormatter } from "../../logging";
/* import { GenericDomains } from "./generic-domains";
import { DisposableDomains } from "./disposable-domains";
import { GenericAccounts } from "./generic-accounts"; */

export const Name = "value:email-address";
export interface Brand {
  readonly [Name]: unique symbol;
}
export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => isRight(C(input)),
  Name
);
export const Is = Codec.is;
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export type T = iots.TypeOf<typeof Codec>;
export const C = (
  input: string
): Either<Errors.Validation.T | Errors.Validation.T, T> => {
  const isEmail = NonEmptyString.Is(input) && validator.isEmail(input);
  if (!isEmail)
    return left(Errors.Validation.C(Name, `Constructor isEmail failed`));
  const normalized = validator.normalizeEmail(input);
  if (!normalized)
    return left(Errors.Validation.C(Name, `Constructor normalizeEmail failed`));
  return right(normalized as T);
};
/* export const HasGenericUserName = (input: T): boolean =>
  GenericAccounts.includes(input.split("@")[0]);

export const IsFromCommonProvider = (input: T): boolean =>
  GenericDomains.includes(input.split("@")[1]);

export const IsDisposable = (input: T): boolean =>
  DisposableDomains.includes(input.split("@")[1]); */
