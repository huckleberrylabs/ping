import { UUID } from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export interface IGetWidgetSettingsQuery extends IWidgetEvent {}

export const GetWidgetSettingsQueryType = "get-widget-settings-query";

export const GetWidgetSettingsQuery = (
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IGetWidgetSettingsQuery => {
  return WidgetEvent(
    widget,
    GetWidgetSettingsQueryType,
    origin,
    corr,
    parent,
    agent
  );
};

export const IsGetWidgetSettingsQuery = (
  input: unknown
): input is IGetWidgetSettingsQuery =>
  IsWidgetEvent(input) && input.type === GetWidgetSettingsQueryType;
