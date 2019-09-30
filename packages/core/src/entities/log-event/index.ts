import {
  UUID,
  NonEmptyString,
  IsNonEmptyString,
  IsKebabCaseString,
  IsNonNullObject,
} from "../../values";
import { Event, IsEvent, IEvent } from "../event";

export type LOG_LEVELS = "critical" | "error" | "debug" | "info";
export type LOG_LABELS = LOG_LEVELS | string;

export interface ILogEvent extends IEvent {
  labels: LOG_LABELS[];
  message: NonEmptyString;
}

export const LogEventType = "log-event";

export const LogEvent = (
  message: NonEmptyString,
  labels: LOG_LABELS[],
  origin: UUID,
  corr?: UUID,
  parent?: UUID
): ILogEvent => {
  if (!IsNonEmptyString(message)) throw new Error("Invalid Message");
  if (!IsLogLabelArray(labels)) throw new Error("Invalid Log Labels");
  const event = Event(LogEventType, origin, corr, parent);
  return {
    ...event,
    labels,
    message,
  };
};

export const IsLogLabelArray = (input: unknown): input is LOG_LABELS[] =>
  Array.isArray(input) && input.every(IsKebabCaseString);

export const IsLogEvent = (input: unknown): input is ILogEvent =>
  IsNonNullObject(input) &&
  IsEvent(input) &&
  input.type === LogEventType &&
  IsLogLabelArray(input.labels) &&
  IsNonEmptyString(input.message);
