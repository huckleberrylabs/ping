import { injectable } from "inversify";
import { UUID } from "@huckleberryai/core";
import {
  IWidgetSettings,
  IsWidgetSettings,
  IWidgetSettingsRepository,
} from "@huckleberryai/widget";
import { FireStore } from "../../utilities";

@injectable()
export class WidgetSettingsRepository implements IWidgetSettingsRepository {
  constructor(private dataStore: FireStore) {}
  async add(widget: IWidgetSettings): Promise<void> {
    const collection = this.dataStore.store.collection("text-widget-settings");
    const docRef = collection.doc(widget.id);
    await docRef.set(widget);
  }
  async getByID(id: UUID): Promise<IWidgetSettings | null> {
    const collection = this.dataStore.store.collection("text-widget-settings");
    const docRef = collection.doc(id);
    const doc = await docRef.get();
    const json = doc.data();
    return IsWidgetSettings(json) ? json : null;
  }
}
