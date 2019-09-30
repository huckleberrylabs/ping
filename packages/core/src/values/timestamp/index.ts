import moment from "moment";
import { IsNonEmptyString } from "../non-empty-string";

export type TimeStamp = string;

export const TimeStamp = () => moment().toISOString();

export const IsTimeStamp = (input: unknown): boolean =>
  IsNonEmptyString(input) && moment(input, moment.ISO_8601).isValid();
