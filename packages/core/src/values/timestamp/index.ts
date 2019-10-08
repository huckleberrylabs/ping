import * as iots from "io-ts";
import { NonEmptyString } from "io-ts-types/lib/NonEmptyString";
import moment from "moment";

export interface TimeStampBrand {
  readonly TimeStamp: unique symbol;
}

export const TimeStampCodec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, TimeStampBrand> => IsTimeStamp(input),
  "TimeStamp"
);

export type TimeStamp = iots.TypeOf<typeof TimeStampCodec>;

export const IsTimeStamp = (input: unknown): input is TimeStamp =>
  NonEmptyString.is(input) && moment(input, moment.ISO_8601).isValid();

export const TimeStamp = () => moment().toISOString() as TimeStamp;
