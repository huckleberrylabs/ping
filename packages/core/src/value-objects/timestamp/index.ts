import moment, { Moment } from "moment";
import { TypeName } from "../type-name";

export type ITimeStamp = Moment;

export type ISerializedTimeStamp = string;

export const TimeStampName = TypeName("TimeStamp");

/** Accepts ISO 8601 string as input. If no input, takes the time right now. */
export const TimeStamp = (input?: string): ITimeStamp => {
  if (input) {
    if (!IsSerializedTimeStamp(input)) {
      throw new Error("TimeStampConstructor: input must be ISO 8601");
    }
    return moment(input);
  }
  return moment();
};

export const IsTimeStamp = (input: unknown): input is ITimeStamp => {
  // Must be Moment Object
  if (moment.isMoment(input)) return true;
  else return false;
};

export const IsSerializedTimeStamp = (
  input: unknown
): input is ISerializedTimeStamp => {
  // Must be string
  if (typeof input !== "string") {
    return false;
  }
  // Must be non-empty string
  if (input.trim().length === 0) {
    return false;
  }
  // Must be ISO 8601
  return moment(input, moment.ISO_8601).isValid();
};

export const TimeStampSerializer = (
  input: ITimeStamp
): ISerializedTimeStamp => {
  if (IsTimeStamp(input)) {
    return input.toISOString();
  }
  throw new Error("TimeStampSerializer: not a ITimeStamp");
};

export const TimeStampDeserializer = (input: unknown): ITimeStamp => {
  if (IsSerializedTimeStamp(input)) {
    return TimeStamp(input);
  }
  throw new Error("SerializedTimeStamp: not a ISerializedTimeStamp");
};
