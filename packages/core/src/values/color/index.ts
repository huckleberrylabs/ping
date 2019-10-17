import { pipe } from "fp-ts/lib/pipeable";
import {
  tryCatch,
  map,
  right,
  left,
  isRight,
  flatten,
  Either,
} from "fp-ts/lib/Either";
import * as iots from "io-ts";
import ColorLib from "color";
import * as Errors from "../../errors";
import * as NonEmptyString from "../non-empty-string";

export interface Brand {
  readonly Color: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => isRight(C(input)),
  "Color"
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  input: string
): Either<Errors.Validation.T | Errors.Parsing.T, T> =>
  pipe(
    NonEmptyString.Is(input) ? right(input) : left(Errors.Validation.C()),
    map(Parse),
    flatten,
    map(Format)
  );

export const Parse = (input: string) =>
  tryCatch(() => ColorLib(input, "hex"), () => Errors.Parsing.C());

export const Format = (color: ColorLib) => color.hex().toLowerCase() as T;

export const Is = Codec.is;
