import { parseName, NameOutput } from "humanparser";
import { some, none, isSome } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import * as NonEmptyString from "../non-empty-string";
import * as OptionFromNullable from "../option-from-nullable";
// Try parse-full-name as well if not working well

export const Name = "core:value:person-name";

export const NameStringCodec = OptionFromNullable.Codec(NonEmptyString.Codec);

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
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (input: NonEmptyString.T) => Map(input, parseName(input));

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

export const FirstLast = (input: T) =>
  `${isSome(input.first) ? input.first.value : ""} ${
    isSome(input.last) ? input.last.value : ""
  }`;
