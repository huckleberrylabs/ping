import { UUID } from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export const WidgetSendMessageCommandType = "widget-send-message-command";

export interface IWidgetSendMessageCommand extends IWidgetEvent {}

export const WidgetSendMessageCommand: (
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
) => IWidgetSendMessageCommand = WidgetEvent(WidgetSendMessageCommandType);

export const IsWidgetSendMessageCommand = (
  input: unknown
): input is IWidgetSendMessageCommand =>
  IsWidgetEvent(input) && input.type !== WidgetSendMessageCommandType;
