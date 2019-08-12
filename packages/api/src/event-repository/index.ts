import { injectable } from "inversify";
import { DataStore } from "../datastore";
import { ID, IEvent } from "@huckleberryai/core";
import { deserializer } from "../event-deserializer";

@injectable()
export class EventRepository {
  constructor(private dataStore: DataStore) {}
  async add(event: IEvent): Promise<void> {
    const { store } = this.dataStore;
    const eventKey = store.key(["Event", event.id.toString()]);
    const json = JSON.parse(JSON.stringify(event));
    const savedEvent = {
      key: eventKey,
      ...json,
    };
    await store.save(savedEvent);
  }
  async getByID(id: ID): Promise<IEvent> {
    const { store } = this.dataStore;
    const eventKey = store.key(["Event", id.toString()]);
    const data = await store.get(eventKey);
    const event = deserializer.deserialize(data);
    return event;
  }
  async getByCorrID(corrID: ID): Promise<IEvent[]> {
    const { store } = this.dataStore;
    const query = store
      .createQuery("Event")
      .filter("corrID", corrID.toString())
      .order("timestamp");
    const [eventData] = await store.runQuery(query);
    const events = eventData.map(data => deserializer.deserialize(data));
    return events;
  }
}
