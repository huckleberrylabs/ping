import { IUUID } from "../uuid";
import {
  Event,
  IsEvent,
  IEvent,
  ISerializedEvent,
  IsSerializedEvent,
  EventSerializer,
  EventDeserializer,
} from "../event";
import { TypeName, TypeNameDeserializer } from "../type-name";

export type LOG_LEVELS = "critical" | "error" | "debug" | "info";

export type LOG_LABELS = LOG_LEVELS | "text";

const LogLabels = ["critical", "error", "debug", "info", "text"];

export interface ILogEvent extends IEvent {
  labels: LOG_LABELS[];
  message: string;
}

export interface ISerializedLogEvent extends ISerializedEvent {
  labels: LOG_LABELS[];
  message: string;
}

export const LogEventName = TypeName("LogEvent");

const IsLogLabelArray = (input: unknown): input is LOG_LABELS[] => {
  // Must be Array
  if (!Array.isArray(input)) {
    return false;
  }
  // Must be Array of valid strings
  for (const elem of input) {
    if (typeof elem !== "string") {
      return false;
    }
    if (!LogLabels.includes(elem)) {
      return false;
    }
  }
  return true;
};

const IsLogMessage = (input: unknown): input is string => {
  // Must be a string
  if (typeof input !== "string") {
    return false;
  }
  // must be non-empty
  if (input.trim().length > 0) {
    return false;
  }
  return true;
};

export const IsLogEvent = (input: unknown): input is ILogEvent => {
  // Must be an Event
  if (!IsEvent(input)) {
    return false;
  }
  // Must have LogEvent Type
  if (input.type !== LogEventName) {
    return false;
  }
  // Must have all properties
  const hasLabels = "labels" in input;
  const hasMessage = "message" in input;
  if (!hasLabels || !hasMessage) {
    return false;
  }
  const { labels, message } = <ILogEvent>input;
  // Must valid log labels
  if (!IsLogLabelArray(labels)) {
    return false;
  }
  // Must have valid message
  if (!IsLogMessage(message)) {
    return false;
  }
  return true;
};

export const IsSerializedLogEvent = (
  input: unknown
): input is ISerializedLogEvent => {
  // Must be an Event
  if (!IsSerializedEvent(input)) {
    return false;
  }
  // Must have LogEvent Type
  if (TypeNameDeserializer(input.type) !== LogEventName) {
    return false;
  }
  // Must have all properties
  const hasLabels = "labels" in input;
  const hasMessage = "message" in input;
  if (!hasLabels || !hasMessage) {
    return false;
  }
  const { labels, message } = <ISerializedLogEvent>input;
  // Must valid log labels
  if (!IsLogLabelArray(labels)) {
    return false;
  }
  // Must have valid message
  if (!IsLogMessage(message)) {
    return false;
  }
  return true;
};

export const LogEvent = (
  message: string,
  labels: LOG_LABELS[],
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID
): ILogEvent => {
  const event = Event(LogEventName, origin, corr, parent);
  if (!IsLogLabelArray(labels)) {
    throw new Error("Invalid Log Labels");
  }
  if (!IsLogMessage(status)) {
    throw new Error("Invalid Message");
  }
  const logEvent = {
    ...event,
    labels,
    message,
  };
  return logEvent;
};

export const LogEventSerializer = (input: ILogEvent): ISerializedLogEvent => {
  if (!IsLogEvent(input)) {
    throw new Error("LogEventSerializer: not a valid LogEvent");
  }
  const event = EventSerializer(input);
  const logEvent = {
    ...event,
    labels: input.labels,
    message: input.message,
  };
  return logEvent;
};

export const LogEventDeserializer = (input: unknown): ILogEvent => {
  if (!IsSerializedLogEvent(input)) {
    throw new Error("LogEventDeserializer: not a valid LogEvent");
  }
  const event = EventDeserializer(input);
  const logEvent = {
    ...event,
    labels: input.labels,
    message: input.message,
  };
  return logEvent;
};
