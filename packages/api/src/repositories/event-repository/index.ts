import { injectable } from "inversify";
import { FireStore } from "../../utilities/firestore";
import { IUUID, UUIDSerializer, IEvent } from "@huckleberryai/core";
import { serializer, deserializer } from "../../structural";

@injectable()
export class EventRepository {
  constructor(private dataStore: FireStore) {}
  async add(event: IEvent): Promise<void> {
    const collection = this.dataStore.store.collection("events");
    const docRef = collection.doc(UUIDSerializer(event.id));
    const json = serializer(event, event.type);
    await docRef.set(json);
  }
  async getByID(id: IUUID): Promise<IEvent | null> {
    const collection = this.dataStore.store.collection("events");
    const docRef = collection.doc(UUIDSerializer(id));
    const doc = await docRef.get();
    const json = doc.data();
    if (json) {
      return deserializer(json, json.type);
    }
    return null;
  }
  async getByCorrID(corrID: IUUID): Promise<IEvent[] | null> {
    const collection = this.dataStore.store.collection("events");
    const query = collection
      .where("corrID", "==", UUIDSerializer(corrID))
      .orderBy("timestamp");
    const queryRef = await query.get();
    if (queryRef.empty) {
      return null;
    } else {
      return queryRef.docs.map(doc =>
        deserializer(doc.data(), doc.data().type)
      );
    }
  }
}
