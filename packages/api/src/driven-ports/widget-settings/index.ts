import { Either, left, isLeft } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberryai/core";
import { Interfaces, Settings } from "@huckleberryai/widget";
import { FireStore } from "../../driven-adapters";

export const Name = "widget:settings";

export const C = (store: FireStore.T): Interfaces.SettingsRepository => ({
  get: async (
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Settings.T>> => {
    const json = (await store
      .collection(Name)
      .doc(UUID.Codec.encode(id))
      .get()).data();
    if (!json) return left(Errors.NotFound.C());
    const settings = Settings.Codec.decode(json);
    if (isLeft(settings)) return left(Errors.Adapter.C());
    return settings;
  },
});
