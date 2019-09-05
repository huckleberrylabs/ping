import {
  IEvent,
  ISerializedEvent,
  Event,
  IsEvent,
  IsSerializedEvent,
  EventSerializer,
  EventDeserializer,
  IUUID,
  ISerializedUUID,
  IsUUID,
  IsSerializedUUID,
  UUIDSerializer,
  UUIDDeserializer,
  ITypeName,
} from "@huckleberryai/core";

export interface ITextWidgetEvent extends IEvent {
  widget: IUUID;
}

export interface ISerializedTextWidgetEvent extends ISerializedEvent {
  widget: ISerializedUUID;
}

export const IsTextWidgetEvent = (
  input: unknown
): input is ITextWidgetEvent => {
  if (!IsEvent(input)) {
    return false;
  }
  // Must have valid Widget UUID
  if ("widget" in input) {
    return false;
  }
  const { widget } = <ITextWidgetEvent>input;
  if (!IsUUID(widget)) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetEvent = (
  input: unknown
): input is ISerializedTextWidgetEvent => {
  if (!IsSerializedEvent(input)) {
    return false;
  }

  // Must have valid Widget UUID
  if ("widget" in input) {
    return false;
  }
  const { widget } = <ISerializedTextWidgetEvent>input;
  if (!IsSerializedUUID(widget)) {
    return false;
  }
  return true;
};

export const TextWidgetEvent = (
  widget: IUUID,
  type: ITypeName,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): ITextWidgetEvent => {
  const event = Event(type, origin, corr, parent, agent);
  return {
    ...event,
    widget,
  };
};

export const TextWidgetEventSerializer = (
  input: ITextWidgetEvent
): ISerializedTextWidgetEvent => {
  if (!IsTextWidgetEvent(input)) {
    throw new Error("TextWidgetEventSerializer: not a valid TextWidgetEvent");
  }
  const event = EventSerializer(input);
  return {
    ...event,
    widget: UUIDSerializer(input.widget),
  };
};

export const TextWidgetEventDeserializer = (
  input: unknown
): ITextWidgetEvent => {
  if (!IsSerializedTextWidgetEvent(input)) {
    throw new Error("TextWidgetEventDeserializer: not a valid TextWidgetEvent");
  }
  const event = EventDeserializer(input);
  return {
    ...event,
    widget: UUIDDeserializer(input.widget),
  };
};
