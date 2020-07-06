import { IEventBus, ISubscriber } from "@huckleberrylabs/ping-core";
import { right } from "fp-ts/lib/Either";

const EventBusRegistry: { [key: string]: ISubscriber[] } = {};

export const C = (): IEventBus => ({
  publish: async events => {
    if (Array.isArray(events)) {
      events.map(event => {
        if (Array.isArray(EventBusRegistry[event.type]))
          EventBusRegistry[event.type].map(subscriber => subscriber(event));
      });
    } else {
      if (Array.isArray(EventBusRegistry[events.type]))
        EventBusRegistry[events.type].map(subscriber => subscriber(events));
    }
    return right(null);
  },
  subscribe: async (name, subscriber) => {
    if (!EventBusRegistry[name]) EventBusRegistry[name] = [];
    EventBusRegistry[name].push(subscriber);
    return right(null);
  },
});
