import {
  TypeName,
  TypeNameDeserializer,
  IUUID,
  ISerializedUUID,
  IsUUID,
  IsSerializedUUID,
  UUIDSerializer,
  UUIDDeserializer,
  IEvent,
  ISerializedEvent,
  IsEvent,
  IsSerializedEvent,
  Event,
  EventSerializer,
  EventDeserializer,
  ILog,
  ISerializedLog,
  LogSerializer,
  LogDeserializer,
} from "@huckleberryai/core";

export interface ITextWidgetUnloadedEvent extends IEvent {
  log: ILog;
  widget: IUUID | null;
}

export interface ISerializedTextWidgetUnloadedEvent extends ISerializedEvent {
  log: ISerializedLog;
  widget: ISerializedUUID | null;
}

export const TextWidgetUnloadedEventName = TypeName("TextWidgetUnloadedEvent");

export const IsTextWidgetUnloadedEvent = (
  input: unknown
): input is ITextWidgetUnloadedEvent => {
  if (!IsEvent(input)) {
    return false;
  }
  // Must have valid Widget UUID
  const { widget, type } = <ITextWidgetUnloadedEvent>input;
  if ("widget" in input) {
    return false;
  }
  if (widget !== null && !IsUUID(widget)) {
    return false;
  }
  // Must have correct TypeName
  if (type !== TextWidgetUnloadedEventName) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetUnloadedEvent = (
  input: unknown
): input is ISerializedTextWidgetUnloadedEvent => {
  if (!IsSerializedEvent(input)) {
    return false;
  }
  const { type, widget } = <ISerializedTextWidgetUnloadedEvent>input;
  // Must have valid Widget UUID
  if ("widget" in input) {
    return false;
  }
  if (widget !== null && !IsSerializedUUID(widget)) {
    return false;
  }
  // Must have correct TypeName
  if (TypeNameDeserializer(type) !== TextWidgetUnloadedEventName) {
    return false;
  }
  return true;
};

export const TextWidgetUnloadedEvent = (
  log: ILog,
  widget: IUUID | null,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): ITextWidgetUnloadedEvent => {
  const event = Event(TextWidgetUnloadedEventName, origin, corr, parent, agent);
  return {
    ...event,
    widget,
    log,
  };
};

export const TextWidgetUnloadedEventSerializer = (
  input: ITextWidgetUnloadedEvent
): ISerializedTextWidgetUnloadedEvent => {
  if (!IsTextWidgetUnloadedEvent(input)) {
    throw new Error(
      "TextWidgetUnloadedEventSerializer: not a valid TextWidgetUnloadedEvent"
    );
  }
  const event = EventSerializer(input);
  return {
    ...event,
    widget: input.widget ? UUIDSerializer(input.widget) : null,
    log: LogSerializer(input.log),
  };
};

export const TextWidgetUnloadedEventDeserializer = (
  input: unknown
): ITextWidgetUnloadedEvent => {
  if (!IsSerializedTextWidgetUnloadedEvent(input)) {
    throw new Error(
      "TextWidgetUnloadedEventDeserializer: not a valid TextWidgetUnloadedEvent"
    );
  }
  const event = EventDeserializer(input);
  return {
    ...event,
    widget: input.widget ? UUIDDeserializer(input.widget) : null,
    log: LogDeserializer(input.log),
  };
};
