import {
  ITextWidgetEvent,
  ISerializedTextWidgetEvent,
  IsTextWidgetEvent,
  IsSerializedTextWidgetEvent,
  TextWidgetEvent,
  TextWidgetEventSerializer,
  TextWidgetEventDeserializer,
} from "./text-widget-event";
import {
  TypeName,
  TypeNameDeserializer,
  IUUID,
  IPersonName,
  ISerializedPersonName,
  IsPersonName,
  IsSerializedPersonName,
  PersonNameSerializer,
  PersonNameDeserializer,
} from "@huckleberryai/core";

export interface ITextWidgetNameAddedCommand extends ITextWidgetEvent {
  name: IPersonName;
}

export interface ISerializedTextWidgetNameAddedCommand
  extends ISerializedTextWidgetEvent {
  name: ISerializedPersonName;
}

export const TextWidgetNameAddedCommandName = TypeName(
  "TextWidgetNameAddedCommand"
);

export const IsTextWidgetNameAddedCommand = (
  input: unknown
): input is ITextWidgetNameAddedCommand => {
  if (!IsTextWidgetEvent(input)) {
    return false;
  }
  // Must have correct TypeName
  const { type, name } = <ITextWidgetNameAddedCommand>input;
  if (type !== TextWidgetNameAddedCommandName) {
    return false;
  }
  // Must have valid name
  if (!("name" in input) || !IsPersonName(name)) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetNameAddedCommand = (
  input: unknown
): input is ISerializedTextWidgetNameAddedCommand => {
  if (!IsSerializedTextWidgetEvent(input)) {
    return false;
  }

  // Must have correct TypeName
  const { type, name } = <ISerializedTextWidgetNameAddedCommand>input;
  if (TypeNameDeserializer(type) !== TextWidgetNameAddedCommandName) {
    return false;
  }
  // Must have valid name
  if (!("name" in input) || !IsSerializedPersonName(name)) {
    return false;
  }
  return true;
};

export const TextWidgetNameAddedCommand = (
  name: IPersonName,
  widget: IUUID,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): ITextWidgetNameAddedCommand => {
  const event = TextWidgetEvent(
    widget,
    TextWidgetNameAddedCommandName,
    origin,
    corr,
    parent,
    agent
  );
  return { ...event, name };
};

export const TextWidgetNameAddedCommandSerializer = (
  input: ITextWidgetNameAddedCommand
): ISerializedTextWidgetNameAddedCommand => {
  if (!IsTextWidgetNameAddedCommand(input)) {
    throw new Error(
      "TextWidgetNameAddedCommandSerializer: not a valid TextWidgetNameAddedCommand"
    );
  }
  const event = TextWidgetEventSerializer(input);
  return { ...event, name: PersonNameSerializer(input.name) };
};

export const TextWidgetNameAddedCommandDeserializer = (
  input: unknown
): ITextWidgetNameAddedCommand => {
  if (!IsSerializedTextWidgetNameAddedCommand(input)) {
    throw new Error(
      "TextWidgetNameAddedCommandDeserializer: not a valid TextWidgetNameAddedCommand"
    );
  }
  const event = TextWidgetEventDeserializer(input);
  return { ...event, name: PersonNameDeserializer(input.name) };
};
