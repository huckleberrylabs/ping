import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import * as Event from "../../values/event";
import * as NameSpaceCaseString from "../../values/namespace-case-string";
import * as Errors from "../../values/errors";
import * as OptionFromNullable from "../../values/option-from-nullable";
import * as Level from "../level";
import { some, none } from "fp-ts/lib/Option";
import { DecodeErrorFormatter } from "../logger";

export const Name = "logging:event" as NameSpaceCaseString.T;
export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      origin: iots.string,
      level: Level.Codec,
      message: OptionFromNullable.Codec(iots.string),
      tags: iots.array(iots.string),
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
type Props = {
  origin: string;
  level: Level.T;
  message?: string;
  tags?: string[];
};
export const C = (props: Props): T => ({
  ...Event.C(),
  type: Name,
  origin: props.origin,
  level: props.level,
  message: props.message ? some(props.message) : none,
  tags: props.tags ? props.tags : [],
});
