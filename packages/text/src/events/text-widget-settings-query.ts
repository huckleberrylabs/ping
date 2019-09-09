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

export interface ITextWidgetSettingsQuery extends ITextWidgetEvent {}

export interface ISerializedTextWidgetSettingsQuery
  extends ISerializedTextWidgetEvent {}

export const TextWidgetSettingsQueryName = TypeName("TextWidgetSettingsQuery");

export const IsTextWidgetSettingsQuery = (
  input: unknown
): input is ITextWidgetSettingsQuery => {
  if (!IsTextWidgetEvent(input)) {
    return false;
  }
  // Must have correct TypeName
  const { type } = <ITextWidgetSettingsQuery>input;
  if (type !== TextWidgetSettingsQueryName) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetSettingsQuery = (
  input: unknown
): input is ISerializedTextWidgetSettingsQuery => {
  if (!IsSerializedTextWidgetEvent(input)) {
    return false;
  }

  // Must have correct TypeName
  const { type } = <ISerializedTextWidgetSettingsQuery>input;
  if (TypeNameDeserializer(type) !== TextWidgetSettingsQueryName) {
    return false;
  }
  return true;
};

export const TextWidgetSettingsQuery = (
  widget: IUUID,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): ITextWidgetSettingsQuery => {
  return TextWidgetEvent(
    widget,
    TextWidgetSettingsQueryName,
    origin,
    corr,
    parent,
    agent
  );
};

export const TextWidgetSettingsQuerySerializer = (
  input: ITextWidgetSettingsQuery
): ISerializedTextWidgetSettingsQuery => {
  if (!IsTextWidgetSettingsQuery(input)) {
    throw new Error(
      "TextWidgetSettingsQuerySerializer: not a valid TextWidgetSettingsQuery"
    );
  }
  return TextWidgetEventSerializer(input);
};

export const TextWidgetSettingsQueryDeserializer = (
  input: unknown
): ITextWidgetSettingsQuery => {
  if (!IsSerializedTextWidgetSettingsQuery(input)) {
    throw new Error(
      "TextWidgetSettingsQueryDeserializer: not a valid TextWidgetSettingsQuery"
    );
  }
  return TextWidgetEventDeserializer(input);
};
