import { Either, right, left } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberrylabs/core";
import { IWidgetTrackingRepository } from "../../../../interfaces";
import { FireStore } from "../../../../driven-adapters";
import { Codecs } from "../events";

export const Name = "widgets:tracking";

export const C = (store: FireStore.T): IWidgetTrackingRepository => ({
  persist: async (id, event): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      const codec = Codecs.get(event.type);
      if (!codec) {
        return left(Errors.Adapter.C());
      }
      await store
        .collection(Name + ":" + id)
        .doc(UUID.Codec.encode(event.id))
        .create(codec.encode(event));
      return right(null);
    } catch (error) {
      console.log(error);
      return left(Errors.Adapter.C());
    }
  },
});
