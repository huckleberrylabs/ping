import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { UUID, NameSpaceCaseString, Errors } from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "messaging:model:channel" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    type: iots.literal(Name),
    id: UUID.Codec,
    account: UUID.Codec,
    kind: iots.union([iots.literal("sms"), iots.literal("widget")]),
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
export const C = (account: UUID.T, kind: "sms" | "widget"): T => ({
  type: Name,
  id: UUID.C(),
  account,
  kind,
});
