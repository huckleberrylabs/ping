import {
  UUID,
  IsUUID,
  IEvent,
  IsEvent,
  Event,
  ILog,
  IsNonNullObject,
} from "@huckleberryai/core";

export interface IClientUnloadedEvent extends IEvent {
  log: ILog;
  widget: UUID | null;
}

export const ClientUnloadedEventType = "client-unloaded-event";

export const ClientUnloadedEvent = (
  log: ILog,
  widget: UUID | null,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IClientUnloadedEvent => {
  const event = Event(ClientUnloadedEventType, origin, corr, parent, agent);
  return {
    ...event,
    widget,
    log,
  };
};

export const IsClientUnloadedEvent = (
  input: unknown
): input is IClientUnloadedEvent =>
  IsNonNullObject(input) &&
  IsEvent(input) &&
  input.type === ClientUnloadedEventType &&
  IsUUID(input.widget);
