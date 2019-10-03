import { PersonName, IsPersonName, IsNonNullObject } from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent } from "../../../base/event";

export const WidgetNameAddedToMessageEventType =
  "widget-name-added-to-message-event";

export interface IWidgetNameAddedToMessageEvent extends IWidgetEvent {
  name: PersonName;
}

export const IsWidgetNameAddedToMessageEvent = (
  input: unknown
): input is IWidgetNameAddedToMessageEvent =>
  IsNonNullObject(input) &&
  IsWidgetEvent(input) &&
  input.type === WidgetNameAddedToMessageEventType &&
  IsPersonName(input.name);
