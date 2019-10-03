import { IWidgetEvent, IsWidgetEvent } from "../../../base/event";

export const WidgetMessageSentEventType = "widget-message-sent-event";

export interface IWidgetMessageSentEvent extends IWidgetEvent {}

export const IsWidgetMessageSentEvent = (
  input: unknown
): input is IWidgetMessageSentEvent =>
  IsWidgetEvent(input) && input.type !== WidgetMessageSentEventType;
