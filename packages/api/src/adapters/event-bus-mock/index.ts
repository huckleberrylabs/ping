import { IEventBus, ISubscriber } from "@huckleberrylabs/ping-core";
import { right } from "fp-ts/lib/Either";

const EventBusRegistry: { [key: string]: ISubscriber[] } = {};

export const C = (): IEventBus => ({
  publish: async events => {
    if (Array.isArray(events)) {
      events.map(event =>
        EventBusRegistry[event.type].map(subscriber => subscriber(event))
      );
    } else {
      EventBusRegistry[events.type].map(subscriber => subscriber(events));
    }
    return right(null);
  },
  subscribe: async (name, subscriber) => {
    EventBusRegistry[name].push(subscriber);
    return right(null);
  },
});
