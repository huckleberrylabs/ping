import { Either, left, isLeft, right } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberryai/core";
import { Interfaces, Account } from "@huckleberryai/ping";
import { FireStore } from "../../driven-adapters";

export const Name = "ping:account";

export const C = (store: FireStore.T): Interfaces.AccountRepository => ({
  get: async (
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Account.T>> => {
    const json = (await store
      .collection(Name)
      .doc(UUID.Codec.encode(id))
      .get()).data();
    if (!json) return left(Errors.NotFound.C());
    const settings = Account.Codec.decode(json);
    if (isLeft(settings)) return left(Errors.Adapter.C());
    return settings;
  },
  add: async (account: Account.T): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(account.id))
        .create(Account.Codec.encode(account));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  update: async (
    account: Account.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>> => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(account.id))
        .update(Account.Codec.encode(account));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  /* remove: async (id: UUID.T): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(id))
        .delete();
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  }, */
});
