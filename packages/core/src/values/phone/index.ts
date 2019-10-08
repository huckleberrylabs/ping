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
import { NonEmptyString } from "io-ts-types/lib/NonEmptyString";
import { parsePhoneNumber, PhoneNumber } from "libphonenumber-js/max";
import { ValidationError, ParsingError } from "../../errors";

interface PhoneBrand {
  readonly Phone: unique symbol;
}

export const PhoneCodec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, PhoneBrand> => isRight(Phone(input)),
  "Phone"
);

export type Phone = iots.TypeOf<typeof PhoneCodec>;

export const Phone = (
  input: string
): Either<ValidationError | ParsingError, Phone> =>
  pipe(
    NonEmptyString.is(input)
      ? right(input)
      : left(new ValidationError("cannot be empty")),
    map(ParsePhone),
    flatten,
    map(PhoneIsPossible),
    flatten,
    map(FormatPhone)
  );

export const ParsePhone = (input: string) =>
  tryCatch(() => parsePhoneNumber(input, "CA"), () => new ParsingError());

export const PhoneIsPossible = (
  input: PhoneNumber
): Either<ValidationError, PhoneNumber> =>
  input.isPossible() ? right(input) : left(new ValidationError());

export const FormatPhone = (phone: PhoneNumber) =>
  phone.format("E.164") as Phone;
