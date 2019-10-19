import { Either, map, tryCatch } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberryai/core";
import { Interfaces } from "@huckleberryai/web-analytics";
import { FireStore } from "../../driven-adapters";
import { pipe } from "fp-ts/lib/pipeable";

export const WebAnalyticsRepository = (
  store: FireStore.T
): Interfaces.Repository => ({
  save: async (
    id: UUID.T,
    event: Interfaces.Events
  ): Promise<Either<Errors.Adapter.T, null>> =>
    pipe(
      tryCatch(
        async () =>
          await store
            .collection("web-analytics")
            .doc(UUID.Codec.encode(id))
            .create(event),
        () => Errors.Adapter.C()
      ),
      map(() => null)
    ),
});
