import {
  UUID,
  NonEmptyString,
  IsNonEmptyString,
  IsNonNullObject,
} from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export const AddTextToWidgetMessageCommandType =
  "add-text-to-widget-message-command";

export interface IAddTextToWidgetMessageCommand extends IWidgetEvent {
  message: NonEmptyString;
}

export const AddTextToWidgetMessageCommand = (
  message: NonEmptyString,
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IAddTextToWidgetMessageCommand => {
  const event = WidgetEvent(AddTextToWidgetMessageCommandType)(
    widget,
    origin,
    corr,
    parent,
    agent
  );
  return { ...event, message };
};

export const IsAddTextToWidgetMessageCommand = (
  input: unknown
): input is IAddTextToWidgetMessageCommand =>
  IsNonNullObject(input) &&
  IsWidgetEvent(input) &&
  input.type === AddTextToWidgetMessageCommandType &&
  IsNonEmptyString(input.message);
