import { Log } from "@huckleberryai/log";
import { UUID, IEvent, Event } from "@huckleberryai/core";
import { FingerPrint } from "../fingerprint";

export interface IWebAnalyticsClientUnloadedEvent extends IEvent {
  log: Log;
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
  log: Log | null,
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

export const NormalizeWebAnalyticsClientUnloadedEvent = (
  input: IWebAnalyticsClientUnloadedEvent
): INormalizedWebAnalyticsClientUnloadedEvent => ({
  ...input,
  log: input.log.log.map(logEntryEvent => logEntryEvent.id),
});
