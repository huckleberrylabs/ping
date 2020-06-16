import { IWidgetTrackingRepository, IEventStore } from "../../../../interfaces";
import { isLeft, right } from "fp-ts/lib/Either";

export const C = (eventStore: IEventStore): IWidgetTrackingRepository => ({
  persist: async (id, event) => {
    const persistedMaybe = await eventStore.persist(id, event);
    if (isLeft(persistedMaybe)) return persistedMaybe;
    return right(null);
  },
});
