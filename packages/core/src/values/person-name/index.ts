import { pipe } from "fp-ts/lib/pipeable";
import { Either, right, left, map } from "fp-ts/lib/Either";
import { some, none } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";
import { NonEmptyString } from "io-ts-types/lib/NonEmptyString";
import { ValidationError } from "../../errors";
import { parseName, NameOutput } from "humanparser";
// Try parse-full-name as well if not working well

export const NameStringCodec = optionFromNullable(NonEmptyString);

export type NameString = iots.TypeOf<typeof NameStringCodec>;

export const PersonNameCodec = iots.type(
  {
    parsed: NameStringCodec,
    legal: NameStringCodec,
    first: NameStringCodec,
    last: NameStringCodec,
    middle: NameStringCodec,
    prefix: NameStringCodec,
    suffix: NameStringCodec,
  },
  "PersonName"
);

export type PersonName = iots.TypeOf<typeof PersonNameCodec>;

export const PersonName = (
  input: string
): Either<ValidationError, PersonName> =>
  pipe(
    NonEmptyString.is(input)
      ? right(input)
      : left(new ValidationError("cannot be empty")),
    map(parseName),
    map(parsed => MapPersonName(input, parsed))
  );

const MapPersonName = (original: string, input: NameOutput) =>
  ({
    parsed: some(original),
    legal: none,
    first: NonEmptyString.is(input.firstName) ? some(input.firstName) : none,
    last: NonEmptyString.is(input.lastName) ? some(input.lastName) : none,
    middle: NonEmptyString.is(input.middleName) ? some(input.middleName) : none,
    prefix: NonEmptyString.is(input.salutation) ? some(input.salutation) : none,
    suffix: NonEmptyString.is(input.suffix) ? some(input.suffix) : none,
  } as PersonName);
