import { Phone, IsPhone, IsNonNullObject } from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent } from "../../../base/event";

export const WidgetPhoneAddedToMessageEventType =
  "widget-phone-added-to-message-event";

export interface IWidgetPhoneAddedToMessageEvent extends IWidgetEvent {
  phone: Phone;
}

export const IsWidgetPhoneAddedToMessageEvent = (
  input: unknown
): input is IWidgetPhoneAddedToMessageEvent =>
  IsNonNullObject(input) &&
  IsWidgetEvent(input) &&
  input.type === WidgetPhoneAddedToMessageEventType &&
  IsPhone(input.phone);
