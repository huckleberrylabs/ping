import {
  TypeName,
  TypeNameDeserializer,
} from "@huckleberryai/core/src/value-objects/type-name";
import { IUUID } from "@huckleberryai/core/src/value-objects/uuid";
import {
  ITextWidgetEvent,
  ISerializedTextWidgetEvent,
  IsTextWidgetEvent,
  IsSerializedTextWidgetEvent,
  TextWidgetEvent,
  TextWidgetEventSerializer,
  TextWidgetEventDeserializer,
} from "./text-widget-event";

export interface ITextWidgetLoadedEvent extends ITextWidgetEvent {}

export interface ISerializedTextWidgetLoadedEvent
  extends ISerializedTextWidgetEvent {}

export const TextWidgetLoadedEventName = TypeName("TextWidgetLoadedEvent");

export const IsTextWidgetLoadedEvent = (
  input: unknown
): input is ITextWidgetLoadedEvent => {
  if (!IsTextWidgetEvent(input)) {
    return false;
  }
  // Must have correct TypeName
  const { type } = <ITextWidgetLoadedEvent>input;
  if (type !== TextWidgetLoadedEventName) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetLoadedEvent = (
  input: unknown
): input is ISerializedTextWidgetLoadedEvent => {
  if (!IsSerializedTextWidgetEvent(input)) {
    return false;
  }

  // Must have correct TypeName
  const { type } = <ISerializedTextWidgetLoadedEvent>input;
  if (TypeNameDeserializer(type) !== TextWidgetLoadedEventName) {
    return false;
  }
  return true;
};

export const TextWidgetLoadedEvent = (
  widget: IUUID,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): ITextWidgetLoadedEvent => {
  return TextWidgetEvent(
    widget,
    TextWidgetLoadedEventName,
    origin,
    corr,
    parent,
    agent
  );
};

export const TextWidgetLoadedEventSerializer = (
  input: ITextWidgetLoadedEvent
): ISerializedTextWidgetLoadedEvent => {
  if (!IsTextWidgetLoadedEvent(input)) {
    throw new Error(
      "TextWidgetLoadedEventSerializer: not a valid TextWidgetLoadedEvent"
    );
  }
  return TextWidgetEventSerializer(input);
};

export const TextWidgetLoadedEventDeserializer = (
  input: unknown
): ITextWidgetLoadedEvent => {
  if (!IsSerializedTextWidgetLoadedEvent(input)) {
    throw new Error(
      "TextWidgetLoadedEventDeserializer: not a valid TextWidgetLoadedEvent"
    );
  }
  return TextWidgetEventDeserializer(input);
};
