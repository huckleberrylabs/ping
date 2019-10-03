import {
  NonEmptyString,
  IsNonEmptyString,
  IsNonNullObject,
} from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent } from "../../../base/event";

export const WidgetTextAddedToMessageEventType =
  "widget-text-added-to-message-event";

export interface IWidgetTextAddedToMessageEvent extends IWidgetEvent {
  message: NonEmptyString;
}

export const IsWidgetTextAddedToMessageEvent = (
  input: unknown
): input is IWidgetTextAddedToMessageEvent =>
  IsNonNullObject(input) &&
  IsWidgetEvent(input) &&
  input.type === WidgetTextAddedToMessageEventType &&
  IsNonEmptyString(input.message);
