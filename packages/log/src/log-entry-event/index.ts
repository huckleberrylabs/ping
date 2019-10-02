import {
  UUID,
  NonEmptyString,
  IsNonEmptyString,
  IsKebabCaseString,
  IsNonNullObject,
  Event,
  IsEvent,
  IEvent,
} from "@huckleberryai/core";

export type LOG_LEVELS = "critical" | "error" | "debug" | "info";
export type LOG_LABELS = LOG_LEVELS | string;

export interface ILogEntryEvent extends IEvent {
  labels: LOG_LABELS[];
  message: NonEmptyString;
}

export const LogEntryEventType = "log-entry-event";

export const LogEntryEvent = (
  message: NonEmptyString,
  labels: LOG_LABELS[],
  origin: UUID,
  corr?: UUID,
  parent?: UUID
): ILogEntryEvent => {
  if (!IsNonEmptyString(message)) throw new Error("Invalid Message");
  if (!IsLogLabelArray(labels)) throw new Error("Invalid Log Labels");
  const event = Event(LogEntryEventType, origin, corr, parent);
  return {
    ...event,
    labels,
    message,
  };
};

export const IsLogLabelArray = (input: unknown): input is LOG_LABELS[] =>
  Array.isArray(input) && input.every(IsKebabCaseString);

export const IsLogEntryEvent = (input: unknown): input is ILogEntryEvent =>
  IsNonNullObject(input) &&
  IsEvent(input) &&
  input.type === LogEntryEventType &&
  IsLogLabelArray(input.labels) &&
  IsNonEmptyString(input.message);
