import {
  ILogEvent,
  ISerializedLogEvent,
  LogEvent,
  LOG_LABELS,
  IsLogEvent,
  IsSerializedLogEvent,
  LogEventSerializer,
  LogEventDeserializer,
} from "../../entities/log-event";
import { ENV } from "../env";
import { IUUID } from "../../value-objects/uuid";
import { IMessage } from "../../value-objects/message";
import {
  ITypeName,
  ISerializedTypeName,
  TypeName,
  TypeNameSerializer,
  TypeNameDeserializer,
} from "../../value-objects/type-name";
import { IsNonNullObject } from "../../value-objects/non-null-object";

export interface ILog {
  type: ITypeName;
  log: ILogEvent[];
  add: (
    message: IMessage,
    labels: LOG_LABELS[],
    origin: IUUID,
    corr?: IUUID,
    parent?: IUUID
  ) => void;
}

export interface ISerializedLog {
  type: ISerializedTypeName;
  log: ISerializedLogEvent[];
}

export const LogName = TypeName("Log");

export const IsLog = (input: unknown): input is ILog => {
  // Must be Object
  if (!IsNonNullObject(input)) {
    return false;
  }
  // Must have all properties
  const hasType = "type" in input;
  const hasLog = "log" in input;
  const hasAdd = "add" in input;
  const { type, log, add } = <ILog>input;
  // Must have all properties
  if (!hasType || !hasLog || !hasAdd) {
    return false;
  }
  // Must have Log Type
  if (type !== LogName) {
    return false;
  }
  // Log must be Array
  if (!Array.isArray(log)) {
    return false;
  }
  // Log must be Array of valid Log Events
  for (const elem of log) {
    if (!IsLogEvent(elem)) {
      return false;
    }
  }
  // Must have add method
  if (typeof add !== "function") {
    return false;
  }
  return true;
};

export const IsSerializedLog = (input: unknown): input is ISerializedLog => {
  // Must be an Object
  if (typeof input !== "object") {
    return false;
  }
  // Must be non-null
  if (input === null) {
    return false;
  }
  // Must have all properties
  const hasType = "type" in input;
  const hasLog = "log" in input;

  // Must have all properties
  if (!hasType || !hasLog) {
    return false;
  }

  const { type, log } = <ISerializedLog>input;

  // Must have Log Type
  if (TypeNameDeserializer(type) !== LogName) {
    return false;
  }
  // Log
  // Must be Array
  if (!Array.isArray(log)) {
    return false;
  }
  // Must be Array of valid Log Events
  for (const elem of log) {
    if (!IsSerializedLogEvent(elem)) {
      return false;
    }
  }
  return true;
};

export const Log = (): ILog => {
  const log: ILog = {
    type: LogName,
    log: [],
    add(
      message: IMessage,
      labels: LOG_LABELS[],
      origin: IUUID,
      corr?: IUUID,
      parent?: IUUID
    ): void {
      const event = LogEvent(message, labels, origin, corr, parent);
      if (ENV === "development" || ENV === "staging") {
        console.log(event.timestamp.toString(), event.labels, event.message);
      }
      this.log.push(event);
    },
  };
  return log;
};

export const LogSerializer = (input: ILog): ISerializedLog => {
  if (!IsLog(input)) {
    throw new Error("LogSerializer: not a valid Log");
  }
  const log = {
    type: TypeNameSerializer(input.type),
    log: input.log.map(logEvent => LogEventSerializer(logEvent)),
  };
  return log;
};

export const LogDeserializer = (input: unknown): ILog => {
  if (!IsSerializedLog(input)) {
    throw new Error("LogDeserializer: not a valid Log");
  }
  const log = Log();
  log.log = input.log.map(logEvent => LogEventDeserializer(logEvent));
  return log;
};

export const log = Log();
