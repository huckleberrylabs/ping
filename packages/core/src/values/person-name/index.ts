import { pipe } from "fp-ts/lib/pipeable";
import { Either, right, left, map } from "fp-ts/lib/Either";
import { some, none } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import * as Errors from "../../errors";
import { parseName, NameOutput } from "humanparser";
import * as NonEmptyString from "../non-empty-string";
import { optionFromNullable } from "../option-from-nullable";
// Try parse-full-name as well if not working well

export const NameStringCodec = optionFromNullable(NonEmptyString.Codec);

export type NameString = iots.TypeOf<typeof NameStringCodec>;

export const Codec = iots.type(
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

export type T = iots.TypeOf<typeof Codec>;

export const C = (input: string): Either<Errors.Validation, T> =>
  pipe(
    NonEmptyString.Is(input)
      ? right(input)
      : left(new Errors.Validation("cannot be empty")),
    map(parseName),
    map(parsed => Map(input, parsed))
  );

const Map = (original: string, input: NameOutput) =>
  ({
    parsed: some(original),
    legal: none,
    first: NonEmptyString.Is(input.firstName) ? some(input.firstName) : none,
    last: NonEmptyString.Is(input.lastName) ? some(input.lastName) : none,
    middle: NonEmptyString.Is(input.middleName) ? some(input.middleName) : none,
    prefix: NonEmptyString.Is(input.salutation) ? some(input.salutation) : none,
    suffix: NonEmptyString.Is(input.suffix) ? some(input.suffix) : none,
  } as T);

export const Is = Codec.is;
