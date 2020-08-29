import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { NameSpaceCaseString, Errors } from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "widget:value:animation" as NameSpaceCaseString.T;
export const Codec = iots.union(
  [
    iots.literal("wiggle"),
    iots.literal("pulse"),
    iots.literal("jolt"),
    iots.literal("none"),
  ],
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
export const DEFAULT = "none";
export const Array: T[] = ["none", "jolt", "pulse", "wiggle"];
export const C = (v?: T): T => (v ? v : DEFAULT);
