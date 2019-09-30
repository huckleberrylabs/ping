import { UUID, Phone, IsPhone, IsNonNullObject } from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export const AddPhoneToWidgetMessageCommandType =
  "text-widget-phone-added-command";

export interface IAddPhoneToWidgetMessageCommand extends IWidgetEvent {
  phone: Phone;
}

export const AddPhoneToWidgetMessageCommand = (
  phone: Phone,
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IAddPhoneToWidgetMessageCommand => {
  const event = WidgetEvent(
    widget,
    AddPhoneToWidgetMessageCommandType,
    origin,
    corr,
    parent,
    agent
  );
  return { ...event, phone };
};

export const IsAddPhoneToWidgetMessageCommand = (
  input: unknown
): input is IAddPhoneToWidgetMessageCommand =>
  IsNonNullObject(input) &&
  IsWidgetEvent(input) &&
  input.type === AddPhoneToWidgetMessageCommandType &&
  IsPhone(input.phone);
