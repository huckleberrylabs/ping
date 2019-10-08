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
import { ParsingError, ValidationError } from "../../errors";
import { IsNonEmptyString } from "../non-empty-string";

export interface ColorBrand {
  readonly Color: unique symbol;
}

export const ColorCodec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, ColorBrand> => isRight(Color(input)),
  "Color"
);

export type Color = iots.TypeOf<typeof ColorCodec>;

export const Color = (
  input: string
): Either<ValidationError | ParsingError, Color> =>
  pipe(
    IsNonEmptyString(input)
      ? right(input)
      : left(new ValidationError("cannot be empty")),
    map(ParseColor),
    flatten,
    map(FormatColor)
  );

export const ParseColor = (input: string) =>
  tryCatch(() => ColorLib(input, "hex"), () => new ParsingError());

export const FormatColor = (color: ColorLib) =>
  color.hex().toLowerCase() as Color;
