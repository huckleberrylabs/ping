import {
  UUID,
  PersonName,
  IsPersonName,
  IsNonNullObject,
} from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export const AddNameToWidgetMessageCommandType =
  "add-name-to-widget-message-command";

export interface IAddNameToWidgetMessageCommand extends IWidgetEvent {
  name: PersonName;
}

export const AddNameToWidgetMessageCommand = (
  name: PersonName,
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IAddNameToWidgetMessageCommand => {
  const event = WidgetEvent(
    widget,
    AddNameToWidgetMessageCommandType,
    origin,
    corr,
    parent,
    agent
  );
  return { ...event, name };
};

export const IsAddNameToWidgetMessageCommand = (
  input: unknown
): input is IAddNameToWidgetMessageCommand =>
  IsNonNullObject(input) &&
  IsWidgetEvent(input) &&
  input.type === AddNameToWidgetMessageCommandType &&
  IsPersonName(input.name);
