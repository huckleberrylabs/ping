import { pipe } from "fp-ts/lib/pipeable";
import { Either, right, left, map } from "fp-ts/lib/Either";
import { some, none } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import { ValidationError } from "../../errors";
import { parseName, NameOutput } from "humanparser";
import { IsNonEmptyString, NonEmptyStringCodec } from "../non-empty-string";
import { optionFromNullable } from "../option-from-nullable";
// Try parse-full-name as well if not working well

export const NameStringCodec = optionFromNullable(NonEmptyStringCodec);

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
    IsNonEmptyString(input)
      ? right(input)
      : left(new ValidationError("cannot be empty")),
    map(parseName),
    map(parsed => MapPersonName(input, parsed))
  );

const MapPersonName = (original: string, input: NameOutput) =>
  ({
    parsed: some(original),
    legal: none,
    first: IsNonEmptyString(input.firstName) ? some(input.firstName) : none,
    last: IsNonEmptyString(input.lastName) ? some(input.lastName) : none,
    middle: IsNonEmptyString(input.middleName) ? some(input.middleName) : none,
    prefix: IsNonEmptyString(input.salutation) ? some(input.salutation) : none,
    suffix: IsNonEmptyString(input.suffix) ? some(input.suffix) : none,
  } as PersonName);
