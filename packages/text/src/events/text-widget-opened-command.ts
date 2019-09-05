import {
  ITextWidgetEvent,
  ISerializedTextWidgetEvent,
  IsTextWidgetEvent,
  IsSerializedTextWidgetEvent,
  TextWidgetEvent,
  TextWidgetEventSerializer,
  TextWidgetEventDeserializer,
} from "./text-widget-event";
import { TypeName, TypeNameDeserializer, IUUID } from "@huckleberryai/core";

export interface ITextWidgetOpenedCommand extends ITextWidgetEvent {}

export interface ISerializedTextWidgetOpenedCommand
  extends ISerializedTextWidgetEvent {}

export const TextWidgetOpenedCommandName = TypeName("TextWidgetOpenedCommand");

export const IsTextWidgetOpenedCommand = (
  input: unknown
): input is ITextWidgetOpenedCommand => {
  if (!IsTextWidgetEvent(input)) {
    return false;
  }
  // Must have correct TypeName
  const { type } = <ITextWidgetOpenedCommand>input;
  if (type !== TextWidgetOpenedCommandName) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetOpenedCommand = (
  input: unknown
): input is ISerializedTextWidgetOpenedCommand => {
  if (!IsSerializedTextWidgetEvent(input)) {
    return false;
  }

  // Must have correct TypeName
  const { type } = <ISerializedTextWidgetOpenedCommand>input;
  if (TypeNameDeserializer(type) !== TextWidgetOpenedCommandName) {
    return false;
  }
  return true;
};

export const TextWidgetOpenedCommand = (
  widget: IUUID,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): ITextWidgetOpenedCommand => {
  return TextWidgetEvent(
    widget,
    TextWidgetOpenedCommandName,
    origin,
    corr,
    parent,
    agent
  );
};

export const TextWidgetOpenedCommandSerializer = (
  input: ITextWidgetOpenedCommand
): ISerializedTextWidgetOpenedCommand => {
  if (!IsTextWidgetOpenedCommand(input)) {
    throw new Error(
      "TextWidgetOpenedCommandSerializer: not a valid TextWidgetOpenedCommand"
    );
  }
  return TextWidgetEventSerializer(input);
};

export const TextWidgetOpenedCommandDeserializer = (
  input: unknown
): ITextWidgetOpenedCommand => {
  if (!IsSerializedTextWidgetOpenedCommand(input)) {
    throw new Error(
      "TextWidgetOpenedCommandDeserializer: not a valid TextWidgetOpenedCommand"
    );
  }
  return TextWidgetEventDeserializer(input);
};
