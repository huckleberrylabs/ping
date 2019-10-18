import { tryCatch, isRight, isLeft, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import ColorLib from "color";
import * as Errors from "../../errors";

export const Name = "core:value:color";
export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => isRight(C(input)),
  Name
);

export type T = iots.TypeOf<typeof Codec>;

/* 

Can Also be written as:

export const C = (input: string) =>
  pipe(
    Parse(input),
    map(Format)
  );

  But Pipes are not very legible and difficult for n00bs
*/
export const C = (input: string) => {
  const parsed = Parse(input);
  if (isLeft(parsed)) return parsed;
  return right(Format(parsed.right));
};

export const Parse = (input: string) =>
  tryCatch(() => ColorLib(input, "hex"), () => Errors.Parsing.C());

export const Format = (color: ColorLib) => color.hex().toLowerCase() as T;

export const Is = Codec.is;
