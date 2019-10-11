import { UUID, Type, Phone, Color } from "@huckleberryai/core";

const DEFAULT_MAIN_COLOR = "white";
const DEFAULT_ACCENT_COLOR = "#1e73be";

export type WidgetSettings = {
  type: Type;
  id: UUID;
  phone: Phone;
  mainColor: Color;
  accentColor: Color;
  enabled: boolean;
};

export const WidgetSettingsType = "widget:settings" as Type;

export const WidgetSettings = (phone: Phone): WidgetSettings => ({
  type: WidgetSettingsType,
  id: UUID(),
  phone: phone,
  mainColor: DEFAULT_MAIN_COLOR as Color,
  accentColor: DEFAULT_ACCENT_COLOR as Color,
  enabled: true,
});
