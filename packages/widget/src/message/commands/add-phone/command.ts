import { UUID, Phone } from "@huckleberryai/core";
import { IWidgetEvent, WidgetEvent } from "../../../base/event";

export const WidgetAddPhoneToMessageCommandType =
  "widget-add-phone-to-message-command";

export interface IWidgetAddPhoneToMessageCommand extends IWidgetEvent {
  phone: Phone;
}

export const WidgetAddPhoneToMessageCommand = (
  phone: Phone,
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IWidgetAddPhoneToMessageCommand => {
  const event = WidgetEvent(WidgetAddPhoneToMessageCommandType)(
    widget,
    origin,
    corr,
    parent,
    agent
  );
  return { ...event, phone };
};
