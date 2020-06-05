import { Either, right, left } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberrylabs/core";
import { Interfaces } from "@huckleberrylabs/ping";
import { FireStore } from "../../driven-adapters";
import Codecs from "../../codecs";

export const Name = "web-analytics";

export const C = (store: FireStore.T): Interfaces.WebAnalyticsRepository => ({
  save: async (
    id: UUID.T,
    event: Interfaces.WebAnalyticsEvents
  ): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      const codec = Codecs.get(event.type);
      if (!codec) {
        return left(Errors.Adapter.C());
      }
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(id))
        .create(codec.encode(event));
      return right(null);
    } catch (error) {
      console.log(error);
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
      console.log(error);
      return left(Errors.Adapter.C());
    }
  },
});
