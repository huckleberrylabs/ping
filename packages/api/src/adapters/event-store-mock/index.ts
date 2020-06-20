import { Event, IEventStore, Errors } from "@huckleberrylabs/ping-core";
import { right, left } from "fp-ts/lib/Either";

const EventStore: { [key: string]: Event.T[] } = {};

export const C = (): IEventStore => ({
  getEventsByStreamID: async stream => {
    if (stream in EventStore) return right(EventStore[stream]);
    return left(Errors.NotFound.C());
  },
  persist: async (stream, event) => {
    const events = Array.isArray(event) ? event : [event];
    if (!(stream in EventStore)) EventStore[stream] = [];
    events.map(event => EventStore[stream].push(event));
    return right(null);
  },
});
