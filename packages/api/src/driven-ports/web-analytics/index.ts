import { Either, right, left } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberryai/core";
import { Interfaces } from "@huckleberryai/web-analytics";
import { FireStore } from "../../driven-adapters";

export const Name = "web-analytics";

export const WebAnalyticsRepository = (
  store: FireStore.T
): Interfaces.Repository => ({
  save: async (
    id: UUID.T,
    event: Interfaces.Events
  ): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(id))
        .create(event);
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  remove: async (id: UUID.T): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(id))
        .delete();
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
});
