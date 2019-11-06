import * as iots from "io-ts";
import moment from "moment";
import * as NonEmptyString from "../non-empty-string";

export const Name = "core:value:time-stamp";

export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T =>
  NonEmptyString.Is(input) && moment(input, moment.ISO_8601).isValid();

export const C = () => moment().toISOString() as T;

export const ToUnix = (input: T) => moment(input).unix();
