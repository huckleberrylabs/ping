import { injectable } from "inversify";
import { FireStore } from "../../utilities";
import { UUID, IEvent, IsEvent, IEventRepository } from "@huckleberryai/core";

@injectable()
export class EventRepository implements IEventRepository {
  constructor(private dataStore: FireStore) {}
  async add(event: IEvent): Promise<void> {
    const collection = this.dataStore.store.collection("events");
    const docRef = collection.doc(event.id);
    await docRef.set(event);
  }
  async getByID(id: UUID): Promise<IEvent | null> {
    const collection = this.dataStore.store.collection("events");
    const docRef = collection.doc(id);
    const doc = await docRef.get();
    const json = doc.data();
    return IsEvent(json) ? json : null;
  }
  async getByCorrID(corrID: UUID): Promise<IEvent[] | null> {
    const collection = this.dataStore.store.collection("events");
    const query = collection.where("corrID", "==", corrID).orderBy("timestamp");
    const queryRef = await query.get();
    return queryRef.empty
      ? null
      : queryRef.docs.map(doc => doc.data()).filter(IsEvent);
  }
}
