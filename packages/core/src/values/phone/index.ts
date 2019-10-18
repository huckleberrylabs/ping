import {
  Either,
  right,
  left,
  isRight,
  tryCatch,
  isLeft,
} from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { parsePhoneNumber } from "libphonenumber-js/max";
import * as Errors from "../../errors";

export const Name = "core:value:phone";

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
  const parsed = Parse(input);
  if (isLeft(parsed)) return parsed;
  if (!parsed.right.isPossible()) return left(Errors.Validation.C());
  return right(parsed.right.format("E.164") as T);
};

export const Parse = (input: string) =>
  tryCatch(() => parsePhoneNumber(input, "CA"), () => Errors.Parsing.C());

export const Is = Codec.is;
