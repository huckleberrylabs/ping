import { Log } from "../../entities/log";
import { ENV } from "../env";
import { LogEvent, LOG_LABELS } from "../../entities";
import { NonEmptyString, UUID } from "../../value-objects";

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
