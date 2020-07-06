import { Either, right, left } from "fp-ts/lib/Either";
import { IAnalyticsRepository, IFireStore } from "../../../interfaces";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import * as Model from "../model";

export const Name = "widget:analytics:repository" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IAnalyticsRepository => ({
  add: async (id, event): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      await store
        .collection(Name + ":" + id)
        .doc(UUID.Codec.encode(event.id))
        .create(Model.Codec.encode(event));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
});
