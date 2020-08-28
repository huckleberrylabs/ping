import { parseName, NameOutput } from "humanparser";
import { some, none, isSome } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import * as NonEmptyString from "../non-empty-string";
import * as OptionFromNullable from "../option-from-nullable";
import * as NameSpaceCaseString from "../namespace-case-string";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export const Name = "value:person-name" as NameSpaceCaseString.T;
export const NameStringCodec = OptionFromNullable.Codec(NonEmptyString.Codec);
export type NameString = iots.TypeOf<typeof NameStringCodec>;
export const Codec = iots.type(
  {
    parsed: NonEmptyString.Codec,
    legal: NameStringCodec,
    first: NameStringCodec,
    last: NameStringCodec,
    middle: NameStringCodec,
    prefix: NameStringCodec,
    suffix: NameStringCodec,
  },
  Name
);
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export const Is = Codec.is;
export type T = iots.TypeOf<typeof Codec>;
export const C = (input: NonEmptyString.T) => Map(input, parseName(input));
const Map = (original: NonEmptyString.T, input: NameOutput) =>
  ({
    parsed: original,
    legal: none,
    first: NonEmptyString.Is(input.firstName) ? some(input.firstName) : none,
    last: NonEmptyString.Is(input.lastName) ? some(input.lastName) : none,
    middle: NonEmptyString.Is(input.middleName) ? some(input.middleName) : none,
    prefix: NonEmptyString.Is(input.salutation) ? some(input.salutation) : none,
    suffix: NonEmptyString.Is(input.suffix) ? some(input.suffix) : none,
  } as T);
export const FirstLast = (input: T) =>
  `${isSome(input.first) ? input.first.value : ""} ${
    isSome(input.last) ? input.last.value : ""
  }`;
