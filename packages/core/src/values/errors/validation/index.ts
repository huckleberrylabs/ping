import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import * as Event from "../../event";
import * as NameSpaceCaseString from "../../namespace-case-string";
import * as OptionFromNullable from "../../option-from-nullable";
import { some, none, isSome } from "fp-ts/lib/Option";
import { Logger, DecodeErrorFormatter } from "../../../logging";

export const Name = "error:validation" as NameSpaceCaseString.T;
export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      origin: iots.string,
      message: OptionFromNullable.Codec(iots.string),
      userMessage: iots.string,
    }),
    Event.Codec,
  ],
  Name
);
export const Is = Codec.is;
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<T, T>>(
    errors => left(C(origin, Name, `Decode: ${DecodeErrorFormatter(errors)}`)),
    decoded => {
      Logger(
        decoded.origin,
        "error",
        isSome(decoded.message) ? decoded.message.value : undefined,
        [Name]
      );
      return right(decoded);
    }
  )(Codec.decode(value));
export const Encode = Codec.encode;
export type T = iots.TypeOf<typeof Codec>;
export const C = (
  origin: string,
  message?: string,
  userMessage?: string
): T => {
  Logger(origin, "error", message, [Name]);
  return {
    ...Event.C(),
    origin,
    message: message ? some(message) : none,
    userMessage: userMessage ? userMessage : "Data provided is invalid.",
    type: Name,
  };
};
