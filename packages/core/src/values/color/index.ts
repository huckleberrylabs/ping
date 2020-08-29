import {
  Either,
  fold,
  left,
  tryCatch,
  isRight,
  isLeft,
  right,
} from "fp-ts/lib/Either";
import * as iots from "io-ts";
import ColorLib from "color";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export const Name = "value:color";
export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => isRight(C(input)),
  Name
);
export const Is = Codec.is;
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export type T = iots.TypeOf<typeof Codec>;
export const C = (input: string) => {
  const parsed = Parse(input);
  if (isLeft(parsed)) return parsed;
  return right(Format(parsed.right));
};
export const Parse = (input: string) =>
  tryCatch(
    () => ColorLib(input, "hex"),
    () => Errors.Validation.C(Name, "Parse")
  );
export const Format = (color: ColorLib) => color.hex().toLowerCase() as T;
export const IsLight = (color: T): boolean => ColorLib(color).isLight();
export const IsDark = (color: T): boolean => ColorLib(color).isDark();
