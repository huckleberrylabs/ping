import { UUID } from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export const CreateWidgetMessageCommandType = "create-widget-message-command";

export interface ICreateWidgetMessageCommand extends IWidgetEvent {}

export const CreateWidgetMessageCommand = (
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): ICreateWidgetMessageCommand => {
  return WidgetEvent(
    widget,
    CreateWidgetMessageCommandType,
    origin,
    corr,
    parent,
    agent
  );
};

export const IsCreateWidgetMessageCommand = (
  input: unknown
): input is ICreateWidgetMessageCommand =>
  IsWidgetEvent(input) && input.type === CreateWidgetMessageCommandType;
