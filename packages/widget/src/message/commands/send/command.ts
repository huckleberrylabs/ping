import { UUID } from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export const SendWidgetMessageCommandType = "send-widget-message-command";

export interface ISendWidgetMessageCommand extends IWidgetEvent {}

export const SendWidgetMessageCommand: (
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
) => ISendWidgetMessageCommand = WidgetEvent(SendWidgetMessageCommandType);

export const IsSendWidgetMessageCommand = (
  input: unknown
): input is ISendWidgetMessageCommand =>
  IsWidgetEvent(input) && input.type !== SendWidgetMessageCommandType;
