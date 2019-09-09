import { injectable } from "inversify";
import { IUUID, UUIDSerializer } from "@huckleberryai/core";
import {
  ITextWidgetSettings,
  TextWidgetSettingsDeserializer,
  TextWidgetSettingsSerializer,
} from "@huckleberryai/text";
import { FireStore } from "../../utilities/firestore";

@injectable()
export class TextWidgetSettingsRepository {
  constructor(private dataStore: FireStore) {}
  async add(widget: ITextWidgetSettings): Promise<void> {
    const collection = this.dataStore.store.collection("text-widget-settings");
    const docRef = collection.doc(UUIDSerializer(widget.id));
    const json = TextWidgetSettingsSerializer(widget);
    await docRef.set(json);
  }
  async getByID(id: IUUID): Promise<ITextWidgetSettings | null> {
    const collection = this.dataStore.store.collection("text-widget-settings");
    const docRef = collection.doc(UUIDSerializer(id));
    const doc = await docRef.get();
    const json = doc.data();
    if (json) {
      return TextWidgetSettingsDeserializer(json);
    }
    return null;
  }
}
