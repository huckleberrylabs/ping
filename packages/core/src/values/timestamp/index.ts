import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import moment from "moment";
import * as NonEmptyString from "../non-empty-string";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export const Name = "value:timestamp";
export interface Brand {
  readonly [Name]: unique symbol;
}
export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
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
export const Is = (input: unknown): input is T =>
  NonEmptyString.Is(input) && moment(input, moment.ISO_8601).isValid();
export type T = iots.TypeOf<typeof Codec>;
export const C = () => moment().toISOString() as T;
export const ToUnix = (input: T) => moment(input).unix();
export const Compare = (left: T, right: T): number =>
  moment.utc(left).diff(moment.utc(right));
