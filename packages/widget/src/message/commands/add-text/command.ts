import { UUID, NonEmptyString } from "@huckleberryai/core";
import { IWidgetEvent, WidgetEvent } from "../../../base/event";

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
