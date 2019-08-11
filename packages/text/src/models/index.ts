import {
  ID,
  WithID,
  WithSerialize,
  staticImplements,
  WithDeserialize,
} from "@huckleberry/core";

@staticImplements<WithDeserialize<TextWidgetSettings>>()
export class TextWidgetSettings implements WithID, WithSerialize {
  public id: ID;
  public enabled: boolean;
  public phone: string;
  public mainColor: string;
  public accentColor: string;
  constructor(phone: string) {
    this.id = new ID();
    this.enabled = true;
    this.phone = phone;
    this.mainColor = "white";
    this.accentColor = "#1e73be";
  }
  public toJSON() {
    return this;
  }
  public static fromJSON(json: any): TextWidgetSettings {
    const textWidgetSettings = new TextWidgetSettings(json.phone);
    textWidgetSettings.id = new ID(json.id);
    textWidgetSettings.enabled = json.enabled;
    textWidgetSettings.mainColor = json.mainColor;
    textWidgetSettings.accentColor = json.accentColor;
    return textWidgetSettings;
  }
}
