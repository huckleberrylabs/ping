import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import {
  TimeStamp,
  NonEmptyString,
  PersonName,
  NameSpaceCaseString,
  Errors,
  PhoneWithCountry,
} from "../../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "widget:value:message" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    timestamp: TimeStamp.Codec,
    text: NonEmptyString.Codec,
    phone: PhoneWithCountry.Codec,
    name: PersonName.Codec,
  },
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
