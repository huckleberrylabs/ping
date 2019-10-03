import {
  ENV,
  UUID,
  NonEmptyString,
  Type,
  IsNonNullObject,
} from "@huckleberryai/core";
import {
  LOG_LABELS,
  ILogEntryEvent,
  LogEntryEvent,
  IsLogEntryEvent,
} from "../log-entry-event";

export const LogType = "log";

export interface ILog {
  type: Type;
  log: ILogEntryEvent[];
}

export const Log = (): ILog => ({
  type: LogType,
  log: [],
});

export const IsLog = (input: unknown): input is ILog =>
  IsNonNullObject(input) &&
  input.type === LogType &&
  Array.isArray(input.log) &&
  input.log.every(IsLogEntryEvent);

export const LOG = Log();

export const log = (
  message: NonEmptyString,
  labels: LOG_LABELS[],
  origin: UUID,
  corr?: UUID,
  parent?: UUID
): void => {
  const event = LogEntryEvent(message, labels, origin, corr, parent);
  if (ENV === "development" || ENV === "test" || ENV === "staging") {
    console.log(event.timestamp.toString(), event.labels, event.message);
  }
  LOG.log.push(event);
};
