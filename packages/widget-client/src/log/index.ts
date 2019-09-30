import {
  ENV,
  NonEmptyString,
  UUID,
  Log,
  LogEvent,
  LOG_LABELS,
} from "@huckleberryai/core";

export const LOG = Log();

export const log = (
  message: NonEmptyString,
  labels: LOG_LABELS[],
  origin: UUID,
  corr?: UUID,
  parent?: UUID
): void => {
  const event = LogEvent(message, labels, origin, corr, parent);
  if (ENV === "development" || ENV === "test" || ENV === "staging") {
    console.log(event.timestamp.toString(), event.labels, event.message);
  }
  LOG.log.push(event);
};
