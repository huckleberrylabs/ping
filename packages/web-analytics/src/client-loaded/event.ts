import {
  UUID,
  IEvent,
  Event,
  IsEvent,
  IsNonNullObject,
  IsUUID,
} from "@huckleberryai/core";

export const WebAnalyticsClientLoadedEventType =
  "web-analytics-client-loaded-event";

export interface IWebAnalyticsClientLoadedEvent extends IEvent {
  app: UUID | null;
}

export const WebAnalyticsClientLoadedEvent = (
  app: UUID | null,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IWebAnalyticsClientLoadedEvent => {
  const event = Event(
    WebAnalyticsClientLoadedEventType,
    origin,
    corr,
    parent,
    agent
  );
  return {
    ...event,
    app,
  };
};

export const IsWebAnalyticsClientLoadedEvent = (
  input: unknown
): input is IWebAnalyticsClientLoadedEvent =>
  IsNonNullObject(input) &&
  IsEvent(input) &&
  input.type === WebAnalyticsClientLoadedEventType &&
  (IsUUID(input.app) || input.app === null);
