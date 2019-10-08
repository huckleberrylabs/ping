import { Phone } from "@huckleberryai/core";
import { IWidgetEvent } from "../../../base/event";

export const WidgetPhoneAddedToMessageEventType =
  "widget-phone-added-to-message-event";

export interface IWidgetPhoneAddedToMessageEvent extends IWidgetEvent {
  phone: Phone;
}
