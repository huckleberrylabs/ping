import {
  UUID,
  PersonName,
  IsPersonName,
  IsNonNullObject,
} from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export const WidgetAddNameToMessageCommandType =
  "widget-add-name-to-message-command";

export interface IWidgetAddNameToMessageCommand extends IWidgetEvent {
  name: PersonName;
}

export const WidgetAddNameToMessageCommand = (
  name: PersonName,
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IWidgetAddNameToMessageCommand => {
  const event = WidgetEvent(WidgetAddNameToMessageCommandType)(
    widget,
    origin,
    corr,
    parent,
    agent
  );
  return { ...event, name };
};

export const IsWidgetAddNameToMessageCommand = (
  input: unknown
): input is IWidgetAddNameToMessageCommand =>
  IsNonNullObject(input) &&
  IsWidgetEvent(input) &&
  input.type === WidgetAddNameToMessageCommandType &&
  IsPersonName(input.name);
