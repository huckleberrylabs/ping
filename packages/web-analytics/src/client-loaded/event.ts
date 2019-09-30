import {
  UUID,
  IEvent,
  Event,
  IsEvent,
  IsNonNullObject,
  IsUUID,
} from "@huckleberryai/core";

export interface IClientLoadedEvent extends IEvent {
  widget: UUID | null;
}

export const ClientLoadedEventType = "client-loaded-event";

export const ClientLoadedEvent = (
  widget: UUID | null,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IClientLoadedEvent => {
  const event = Event(ClientLoadedEventType, origin, corr, parent, agent);
  return {
    ...event,
    widget,
  };
};

export const IsClientLoadedEvent = (
  input: unknown
): input is IClientLoadedEvent =>
  IsNonNullObject(input) &&
  IsEvent(input) &&
  input.type === ClientLoadedEventType &&
  IsUUID(input.widget);
