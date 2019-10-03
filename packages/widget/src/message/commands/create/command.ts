import { UUID } from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export const WidgetCreateMessageCommandType = " widget-create-message-command";

export interface IWidgetCreateMessageCommand extends IWidgetEvent {}

export const WidgetCreateMessageCommand: (
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
) => IWidgetCreateMessageCommand = WidgetEvent(WidgetCreateMessageCommandType);

export const IsWidgetCreateMessageCommand = (
  input: unknown
): input is IWidgetCreateMessageCommand =>
  IsWidgetEvent(input) && input.type === WidgetCreateMessageCommandType;
