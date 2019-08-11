import { injectable } from "inversify";
import { ID } from "@huckleberry/core";
import { TextWidgetSettings } from "@huckleberry/text";
import { DataStore } from "../datastore";

@injectable()
export class TextWidgetSettingsRepository {
  constructor(private dataStore: DataStore) {}
  async add(app: TextWidgetSettings): Promise<void> {
    const { store } = this.dataStore;
    const appKey = store.key(["TextWidgetSettings", app.id.toString()]);
    const json = JSON.parse(JSON.stringify(app.toJSON));
    const savedEvent = {
      key: appKey,
      ...json,
    };
    await store.save(savedEvent);
  }
  async getByID(id: ID): Promise<TextWidgetSettings> {
    const { store } = this.dataStore;
    const appKey = store.key(["TextWidgetSettings", id.toString()]);
    const json = await store.get(appKey);
    return TextWidgetSettings.fromJSON(json);
  }
}
