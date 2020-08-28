import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import {
  UUID,
  Phone,
  NameSpaceCaseString,
  TimeStamp,
  Errors,
} from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "sms:model:number-pairing" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    type: iots.literal(Name),
    created: TimeStamp.Codec,
    account: UUID.Codec,
    conversation: UUID.Codec,
    to: Phone.Codec,
    from: Phone.Codec,
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
export const C = (
  account: UUID.T,
  conversation: UUID.T,
  to: Phone.T,
  from: Phone.T
): T => ({
  type: Name,
  created: TimeStamp.C(),
  account,
  conversation,
  to,
  from,
});
