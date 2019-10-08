import { Type, UUID, IEvent, Event } from "@huckleberryai/core";

export interface IWidgetEvent extends IEvent {
  widget: UUID;
}

export const WidgetEvent = (type: Type) => (
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IWidgetEvent => {
  const event = Event(type, origin, corr, parent, agent);
  return {
    ...event,
    widget,
  };
};
