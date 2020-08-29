import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import {
  Event,
  NonEmptyString,
  NameSpaceCaseString,
  Errors,
} from "../../../values";
import { Command } from "../use-cases/login-with-token";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "auth:event:logged-in-with-token" as NameSpaceCaseString.T;
export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      token: NonEmptyString.Codec,
    }),
    Event.Codec,
  ],
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
export const C = (command: Command.T): T => ({
  ...command,
  type: Name,
});
