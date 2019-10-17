import { pipe } from "fp-ts/lib/pipeable";
import {
  Either,
  right,
  left,
  isRight,
  map,
  tryCatch,
  flatten,
} from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { parsePhoneNumber, PhoneNumber } from "libphonenumber-js/max";
import * as Errors from "../../errors";
import * as NonEmptyString from "../non-empty-string";

export interface Brand {
  readonly Phone: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => isRight(C(input)),
  "Phone"
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  input: string
): Either<Errors.Validation.T | Errors.Parsing.T, T> =>
  pipe(
    NonEmptyString.Is(input) ? right(input) : left(Errors.Validation.C()),
    map(Parse),
    flatten,
    map(IsPossible),
    flatten,
    map(Format)
  );

export const Parse = (input: string) =>
  tryCatch(() => parsePhoneNumber(input, "CA"), () => Errors.Parsing.C());

export const IsPossible = (
  input: PhoneNumber
): Either<Errors.Validation.T, PhoneNumber> =>
  input.isPossible() ? right(input) : left(Errors.Validation.C());

export const Format = (phone: PhoneNumber) => phone.format("E.164") as T;

export const Is = Codec.is;
