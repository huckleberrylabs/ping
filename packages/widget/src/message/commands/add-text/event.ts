import { IWidgetEvent } from "../../../base/event";

export const WidgetTextAddedToMessageEventType =
  "widget-text-added-to-message-event";

export interface IWidgetTextAddedToMessageEvent extends IWidgetEvent {
  message: NonEmptyString;
}
