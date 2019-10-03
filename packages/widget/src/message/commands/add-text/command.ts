import {
  UUID,
  NonEmptyString,
  IsNonEmptyString,
  IsNonNullObject,
} from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export const WidgetAddTextToMessageCommandType =
  "widget-add-text-to-message-command";

export interface IWidgetAddTextToMessageCommand extends IWidgetEvent {
  message: NonEmptyString;
}

export const WidgetAddTextToMessageCommand = (
  message: NonEmptyString,
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IWidgetAddTextToMessageCommand => {
  const event = WidgetEvent(WidgetAddTextToMessageCommandType)(
    widget,
    origin,
    corr,
    parent,
    agent
  );
  return { ...event, message };
};

export const IsWidgetAddTextToMessageCommand = (
  input: unknown
): input is IWidgetAddTextToMessageCommand =>
  IsNonNullObject(input) &&
  IsWidgetEvent(input) &&
  input.type === WidgetAddTextToMessageCommandType &&
  IsNonEmptyString(input.message);
