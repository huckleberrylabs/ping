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

export interface ITextWidgetMessageAddedCommand extends ITextWidgetEvent {
  message: Message;
}

export interface ISerializedTextWidgetMessageAddedCommand
  extends ISerializedTextWidgetEvent {
  message: Message;
}

export const TextWidgetMessageAddedCommandName = TypeName(
  "TextWidgetMessageAddedCommand"
);

type Message = string;

const IsMessage = (input: unknown): input is Message => {
  return typeof input === "string" && input.trim().length > 2;
};

export const IsTextWidgetMessageAddedCommand = (
  input: unknown
): input is ITextWidgetMessageAddedCommand => {
  if (!IsTextWidgetEvent(input)) {
    return false;
  }
  // Must have correct TypeName
  const { type, message } = <ITextWidgetMessageAddedCommand>input;
  if (type !== TextWidgetMessageAddedCommandName) {
    return false;
  }
  // Must have valid message
  if (!("message" in input) || !IsMessage(message)) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetMessageAddedCommand = (
  input: unknown
): input is ISerializedTextWidgetMessageAddedCommand => {
  if (!IsSerializedTextWidgetEvent(input)) {
    return false;
  }

  // Must have correct TypeName
  const { type, message } = <ISerializedTextWidgetMessageAddedCommand>input;
  if (TypeNameDeserializer(type) !== TextWidgetMessageAddedCommandName) {
    return false;
  }
  // Must have valid message
  if (!("message" in input) || !IsMessage(message)) {
    return false;
  }
  return true;
};

export const TextWidgetMessageAddedCommand = (
  message: string,
  widget: IUUID,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): ITextWidgetMessageAddedCommand => {
  const event = TextWidgetEvent(
    widget,
    TextWidgetMessageAddedCommandName,
    origin,
    corr,
    parent,
    agent
  );
  return { ...event, message };
};

export const TextWidgetMessageAddedCommandSerializer = (
  input: ITextWidgetMessageAddedCommand
): ISerializedTextWidgetMessageAddedCommand => {
  if (!IsTextWidgetMessageAddedCommand(input)) {
    throw new Error(
      "TextWidgetMessageAddedCommandSerializer: not a valid TextWidgetMessageAddedCommand"
    );
  }
  const event = TextWidgetEventSerializer(input);
  return { ...event, message: input.message };
};

export const TextWidgetMessageAddedCommandDeserializer = (
  input: unknown
): ITextWidgetMessageAddedCommand => {
  if (!IsSerializedTextWidgetMessageAddedCommand(input)) {
    throw new Error(
      "TextWidgetMessageAddedCommandDeserializer: not a valid TextWidgetMessageAddedCommand"
    );
  }
  const event = TextWidgetEventDeserializer(input);
  return { ...event, message: input.message };
};
