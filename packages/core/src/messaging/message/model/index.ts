import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import {
  UUID,
  TimeStamp,
  NonEmptyString,
  NameSpaceCaseString,
  OptionFromNullable,
  Errors,
} from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "messaging:model:message" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    type: iots.literal(Name),
    account: UUID.Codec,
    id: UUID.Codec,
    timestamp: TimeStamp.Codec,
    from: UUID.Codec,
    channel: UUID.Codec,
    conversation: OptionFromNullable.Codec(UUID.Codec),
    content: NonEmptyString.Codec,
    meta: iots.record(iots.string, iots.string),
  },
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
