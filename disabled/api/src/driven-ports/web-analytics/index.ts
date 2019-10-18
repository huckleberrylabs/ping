import { Either, tryCatch } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberryai/core";
import { Interfaces } from "@huckleberryai/web-analytics";
import { FireStore } from "../../driven-adapters";
import { pipe } from "fp-ts/lib/pipeable";
import { map } from "twilio/lib/base/serialize";

export const WebAnalyticsRepository = (
  store: FireStore.T
): Partial<Interfaces.Repository> => ({
  save: (
    id: UUID.T,
    event: Interfaces.Event
  ): Promise<Either<Errors.Adapter.T, null>> =>
    pipe(
      tryCatch(
        () =>
          store
            .collection("my=collection")
            .doc(UUID.Codec.encode(id))
            .create(event),
        () => Errors.Adapter.C()
      ),
      map(() => null)
    ),
});
