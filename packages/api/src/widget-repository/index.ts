import { injectable } from "inversify";
import { ID } from "@huckleberryai/core";
import { TextWidgetSettings } from "@huckleberryai/text";
import { FireStore } from "../firestore";

@injectable()
export class TextWidgetSettingsRepository {
  constructor(private dataStore: FireStore) {}
  async add(widget: TextWidgetSettings): Promise<void> {
    const collection = this.dataStore.store.collection("text-widget-settings");
    const docRef = collection.doc(widget.id.toString());
    const json = JSON.parse(JSON.stringify(widget));
    await docRef.set(json);
  }
  async getByID(id: ID): Promise<TextWidgetSettings> {
    const collection = this.dataStore.store.collection("text-widget-settings");
    const docRef = collection.doc(id.toString());
    const doc = await docRef.get();
    return TextWidgetSettings.fromJSON(doc.data());
  }
}
