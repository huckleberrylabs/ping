import { Either, left, isLeft, right, isRight } from "fp-ts/lib/Either";
import { UUID, Errors, EmailAddress } from "@huckleberryai/core";
import { Interfaces, Account } from "@huckleberryai/ping";
import { FireStore } from "../../driven-adapters";

export const Name = "ping:account";

export const C = (store: FireStore.T): Interfaces.AccountRepository => ({
  get: async (
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Account.T>> => {
    console.log("ping:account:repository:get:id", id);
    const json = (
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(id))
        .get()
    ).data();
    console.log("ping:account:repository:get:json ", json);
    if (!json) return left(Errors.NotFound.C());
    const settings = Account.Codec.decode(json);
    console.log("ping:account:repository:get:decoded", settings);
    if (isLeft(settings)) return left(Errors.Adapter.C());
    return settings;
  },
  getByEmail: async (
    email: EmailAddress.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Account.T[]>> => {
    try {
      const queryRef = await store
        .collection(Name)
        .where("email", "==", email)
        .get();
      if (queryRef.empty) return left(Errors.NotFound.C());
      const json = queryRef.docs.map(doc => doc.data());
      const maybeAccounts = json.map(json => {
        const maybeDecoded = Account.Codec.decode(json);
        if (isLeft(maybeDecoded)) return left(Errors.Validation.C());
        return maybeDecoded;
      });
      if (maybeAccounts.some(isLeft)) return left(Errors.Adapter.C());
      return right(maybeAccounts.filter(isRight).map(account => account.right));
    } catch (error) {
      return left(Errors.Adapter.C());
    }
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
