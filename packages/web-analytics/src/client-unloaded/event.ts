import { ILog, IsLog } from "@huckleberryai/log";
import {
  UUID,
  IsUUID,
  IEvent,
  IsEvent,
  Event,
  IsNonNullObject,
} from "@huckleberryai/core";
import { FingerPrint, IsFingerPrint } from "../fingerprint";

export interface IWebAnalyticsClientUnloadedEvent extends IEvent {
  log: ILog;
  fingerprint: FingerPrint | null;
  app: UUID | null;
}

export interface INormalizedWebAnalyticsClientUnloadedEvent extends IEvent {
  log: UUID[];
  fingerprint: FingerPrint | null;
  app: UUID | null;
}

export const WebAnalyticsClientUnloadedEventType = "client-unloaded-event";

export const WebAnalyticsClientUnloadedEvent = (
  log: ILog,
  fingerprint: FingerPrint | null,
  app: UUID | null,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IWebAnalyticsClientUnloadedEvent => {
  const event = Event(
    WebAnalyticsClientUnloadedEventType,
    origin,
    corr,
    parent,
    agent
  );
  return {
    ...event,
    app,
    log,
    fingerprint,
  };
};

export const IsWebAnalyticsClientUnloadedEvent = (
  input: unknown
): input is IWebAnalyticsClientUnloadedEvent =>
  IsNonNullObject(input) &&
  IsEvent(input) &&
  input.type === WebAnalyticsClientUnloadedEventType &&
  (IsUUID(input.app) || input.app === null) &&
  IsLog(input.log) &&
  (IsFingerPrint(input.fingerprint) || input.fingerprint === null);

export const NormalizeWebAnalyticsClientUnloadedEvent = (
  input: IWebAnalyticsClientUnloadedEvent
): INormalizedWebAnalyticsClientUnloadedEvent => ({
  ...input,
  log: input.log.log.map(logEntryEvent => logEntryEvent.id),
});
