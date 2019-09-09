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

export interface ITextWidgetSentCommand extends ITextWidgetEvent {}

export interface ISerializedTextWidgetSentCommand
  extends ISerializedTextWidgetEvent {}

export const TextWidgetSentCommandName = TypeName("TextWidgetSentCommand");

export const IsTextWidgetSentCommand = (
  input: unknown
): input is ITextWidgetSentCommand => {
  if (!IsTextWidgetEvent(input)) {
    return false;
  }
  // Must have correct TypeName
  const { type } = <ITextWidgetSentCommand>input;
  if (type !== TextWidgetSentCommandName) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetSentCommand = (
  input: unknown
): input is ISerializedTextWidgetSentCommand => {
  if (!IsSerializedTextWidgetEvent(input)) {
    return false;
  }

  // Must have correct TypeName
  const { type } = <ISerializedTextWidgetSentCommand>input;
  if (TypeNameDeserializer(type) !== TextWidgetSentCommandName) {
    return false;
  }
  return true;
};

export const TextWidgetSentCommand = (
  widget: IUUID,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): ITextWidgetSentCommand => {
  return TextWidgetEvent(
    widget,
    TextWidgetSentCommandName,
    origin,
    corr,
    parent,
    agent
  );
};

export const TextWidgetSentCommandSerializer = (
  input: ITextWidgetSentCommand
): ISerializedTextWidgetSentCommand => {
  if (!IsTextWidgetSentCommand(input)) {
    throw new Error(
      "TextWidgetSentCommandSerializer: not a valid TextWidgetSentCommand"
    );
  }
  return TextWidgetEventSerializer(input);
};

export const TextWidgetSentCommandDeserializer = (
  input: unknown
): ITextWidgetSentCommand => {
  if (!IsSerializedTextWidgetSentCommand(input)) {
    throw new Error(
      "TextWidgetSentCommandDeserializer: not a valid TextWidgetSentCommand"
    );
  }
  return TextWidgetEventDeserializer(input);
};
