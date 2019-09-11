import {
  TypeName,
  TypeNameDeserializer,
  IUUID,
  IPhone,
  ISerializedPhone,
  IsPhone,
  IsSerializedPhone,
  PhoneSerializer,
  PhoneDeserializer,
} from "@huckleberryai/core";

import {
  ITextWidgetEvent,
  ISerializedTextWidgetEvent,
  IsTextWidgetEvent,
  IsSerializedTextWidgetEvent,
  TextWidgetEvent,
  TextWidgetEventSerializer,
  TextWidgetEventDeserializer,
} from "./text-widget-event";

export interface ITextWidgetPhoneAddedCommand extends ITextWidgetEvent {
  phone: IPhone;
}

export interface ISerializedTextWidgetPhoneAddedCommand
  extends ISerializedTextWidgetEvent {
  phone: ISerializedPhone;
}

export const TextWidgetPhoneAddedCommandName = TypeName(
  "TextWidgetPhoneAddedCommand"
);

export const IsTextWidgetPhoneAddedCommand = (
  input: unknown
): input is ITextWidgetPhoneAddedCommand => {
  if (!IsTextWidgetEvent(input)) {
    return false;
  }
  // Must have correct TypeName
  const { type, phone } = <ITextWidgetPhoneAddedCommand>input;
  if (type !== TextWidgetPhoneAddedCommandName) {
    return false;
  }
  // Must have valid phone
  if (!("phone" in input) || !IsPhone(phone)) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetPhoneAddedCommand = (
  input: unknown
): input is ISerializedTextWidgetPhoneAddedCommand => {
  if (!IsSerializedTextWidgetEvent(input)) {
    return false;
  }

  // Must have correct TypeName
  const { type, phone } = <ISerializedTextWidgetPhoneAddedCommand>input;
  if (TypeNameDeserializer(type) !== TextWidgetPhoneAddedCommandName) {
    return false;
  }
  // Must have valid phone
  if (!("phone" in input) || !IsSerializedPhone(phone)) {
    return false;
  }
  return true;
};

export const TextWidgetPhoneAddedCommand = (
  phone: IPhone,
  widget: IUUID,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): ITextWidgetPhoneAddedCommand => {
  const event = TextWidgetEvent(
    widget,
    TextWidgetPhoneAddedCommandName,
    origin,
    corr,
    parent,
    agent
  );
  return { ...event, phone };
};

export const TextWidgetPhoneAddedCommandSerializer = (
  input: ITextWidgetPhoneAddedCommand
): ISerializedTextWidgetPhoneAddedCommand => {
  if (!IsTextWidgetPhoneAddedCommand(input)) {
    throw new Error(
      "TextWidgetPhoneAddedCommandSerializer: not a valid TextWidgetPhoneAddedCommand"
    );
  }
  const event = TextWidgetEventSerializer(input);
  return { ...event, phone: PhoneSerializer(input.phone) };
};

export const TextWidgetPhoneAddedCommandDeserializer = (
  input: unknown
): ITextWidgetPhoneAddedCommand => {
  if (!IsSerializedTextWidgetPhoneAddedCommand(input)) {
    throw new Error(
      "TextWidgetPhoneAddedCommandDeserializer: not a valid TextWidgetPhoneAddedCommand"
    );
  }
  const event = TextWidgetEventDeserializer(input);
  return { ...event, phone: PhoneDeserializer(input.phone) };
};
