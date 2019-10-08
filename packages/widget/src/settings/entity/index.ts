import { UUID, Type, Phone, Color, JSON } from "@huckleberryai/core";

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
