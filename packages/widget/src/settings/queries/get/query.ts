import { UUID } from "@huckleberryai/core";
import { IWidgetEvent, IsWidgetEvent, WidgetEvent } from "../../../base/event";

export interface IWidgetGetSettingsQuery extends IWidgetEvent {}

export const WidgetGetSettingsQueryType = "widget-get-settings-query";

export const WidgetGetSettingsQuery: (
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
) => IWidgetGetSettingsQuery = WidgetEvent(WidgetGetSettingsQueryType);

export const IsWidgetGetSettingsQuery = (
  input: unknown
): input is IWidgetGetSettingsQuery =>
  IsWidgetEvent(input) && input.type === WidgetGetSettingsQueryType;
