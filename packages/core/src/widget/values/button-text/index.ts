import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { NameSpaceCaseString, Errors } from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "widget:value:button-text" as NameSpaceCaseString.T;
export const Codec = iots.union(
  [
    iots.literal("none"),
    iots.literal("ping"),
    iots.literal("ping me"),
    iots.literal("ping us"),
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
export const DEFAULT = "ping";
export const Array: T[] = ["none", "ping", "ping me", "ping us"];
export const C = (v?: T): T => (v ? v : DEFAULT);
