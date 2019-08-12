import { injectable } from "inversify";
import { FireStore } from "../firestore";
import { ID, IEvent } from "@huckleberryai/core";
import { deserialize } from "../event-deserializer";

@injectable()
export class EventRepository {
  constructor(private dataStore: FireStore) {}
  async add(event: IEvent): Promise<void> {
    const collection = this.dataStore.store.collection("events");
    const docRef = collection.doc(event.id.toString());
    const json = JSON.parse(JSON.stringify(event));
    await docRef.set(json);
  }
  async getByID(id: ID): Promise<IEvent> {
    const collection = this.dataStore.store.collection("events");
    const docRef = collection.doc(id.toString());
    const doc = await docRef.get();
    const event = deserialize(doc.data());
    return event;
  }
  async getByCorrID(corrID: ID): Promise<IEvent[]> {
    const collection = this.dataStore.store.collection("events");
    const query = collection
      .where("corrID", "==", corrID.toString())
      .orderBy("timestamp");
    const queryRef = await query.get();
    if (queryRef.empty) {
      return [];
    } else {
      return queryRef.docs.map(doc => deserialize(doc.data()));
    }
  }
}
