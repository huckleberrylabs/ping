import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { UUID, Event, NameSpaceCaseString, Errors } from "../../../../values";
import { DecodeErrorFormatter } from "../../../../logging";

export const Name = "widget:analytics:query:get-by-widget" as NameSpaceCaseString.T;
export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name), widget: UUID.Codec }), Event.Codec],
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
export const C = (widget: UUID.T): T => ({
  ...Event.C(),
  widget,
  type: Name,
});
