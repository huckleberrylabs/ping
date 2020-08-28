import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import {
  Event,
  Phone,
  NameSpaceCaseString,
  NonEmptyString,
  Errors,
} from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "sms:command:receive" as NameSpaceCaseString.T;
export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      content: NonEmptyString.Codec,
      twilio: Phone.Codec,
      from: Phone.Codec,
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
export const C = (
  content: NonEmptyString.T,
  twilio: Phone.T,
  from: Phone.T
): T => ({
  ...Event.C(),
  type: Name,
  content,
  twilio,
  from,
});
