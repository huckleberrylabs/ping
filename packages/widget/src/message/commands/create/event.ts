import { IWidgetEvent, IsWidgetEvent } from "../../../base/event";

export const WidgetMessageCreatedEventType = " widget-message-created-event";

export interface IWidgetMessageCreatedEvent extends IWidgetEvent {}

export const IsWidgetMessageCreatedEvent = (
  input: unknown
): input is IWidgetMessageCreatedEvent =>
  IsWidgetEvent(input) && input.type === WidgetMessageCreatedEventType;
