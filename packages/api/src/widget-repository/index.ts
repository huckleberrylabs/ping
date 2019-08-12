import { injectable } from "inversify";
import { ID } from "@huckleberryai/core";
import { TextWidgetSettings } from "@huckleberryai/text";
import { DataStore } from "../datastore";

@injectable()
export class TextWidgetSettingsRepository {
  constructor(private dataStore: DataStore) {}
  async add(widget: TextWidgetSettings): Promise<void> {
    const { store } = this.dataStore;
    const widgetKey = store.key(["TextWidgetSettings", widget.id.toString()]);
    const json = JSON.parse(JSON.stringify(widget.toJSON));
    const savedEvent = {
      key: widgetKey,
      ...json,
    };
    await store.save(savedEvent);
  }
  async getByID(id: ID): Promise<TextWidgetSettings> {
    const { store } = this.dataStore;
    const widgetKey = store.key(["TextWidgetSettings", id.toString()]);
    const json = await store.get(widgetKey);
    return TextWidgetSettings.fromJSON(json);
  }
}
