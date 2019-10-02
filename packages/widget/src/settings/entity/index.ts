import {
  IsNonNullObject,
  UUID,
  Type,
  Phone,
  Color,
  IsType,
  IsUUID,
  IsPhone,
  IsColor,
  JSON,
} from "@huckleberryai/core";

const DEFAULT_MAIN_COLOR = "white";
const DEFAULT_ACCENT_COLOR = "#1e73be";

export interface IWidgetSettings {
  [index: string]: JSON;
  type: Type;
  id: UUID;
  phone: Phone;
  mainColor: Color;
  accentColor: Color;
  enabled: boolean;
}

export const WidgetSettingsType = "widget-settings";

export const WidgetSettings = (phone: Phone): IWidgetSettings => {
  const textWidgetSettings = {
    type: WidgetSettingsType,
    id: UUID(),
    phone: phone,
    mainColor: DEFAULT_MAIN_COLOR,
    accentColor: DEFAULT_ACCENT_COLOR,
    enabled: true,
  };
  return textWidgetSettings;
};

export const IsWidgetSettings = (input: unknown): input is IWidgetSettings =>
  IsNonNullObject(input) &&
  IsType(input.type) &&
  IsUUID(input.id) &&
  IsPhone(input.phone) &&
  IsColor(input.mainColor) &&
  IsColor(input.accentColor) &&
  typeof input.enabled === "boolean";
