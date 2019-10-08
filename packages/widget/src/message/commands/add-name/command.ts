import { UUID, PersonName } from "@huckleberryai/core";
import { IWidgetEvent, WidgetEvent } from "../../../base/event";

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
