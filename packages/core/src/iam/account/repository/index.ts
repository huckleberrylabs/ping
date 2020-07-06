import { left, isLeft, right, isRight } from "fp-ts/lib/Either";
import { IAccountRepository, IFireStore } from "../../../interfaces";
import { NameSpaceCaseString, UUID, Errors } from "../../../values";
import * as Model from "../model";

export const Name = "auth:repository:account" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IAccountRepository => ({
  get: async id => {
    const json = (
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(id))
        .get()
    ).data();
    if (!json) return left(Errors.NotFound.C());
    const settings = Model.Codec.decode(json);
    if (isLeft(settings)) return left(Errors.Adapter.C());
    return settings;
  },
  getByEmail: async email => {
    try {
      const queryRef = await store
        .collection(Name)
        .where("email.address", "==", email)
        .get();
      if (queryRef.empty) return left(Errors.NotFound.C());
      const json = queryRef.docs.map(doc => doc.data());
      const maybeAccounts = json.map(json => {
        const maybeDecoded = Model.Codec.decode(json);
        if (isLeft(maybeDecoded)) return left(Errors.Validation.C());
        return maybeDecoded;
      });
      if (maybeAccounts.some(isLeft)) return left(Errors.Adapter.C());
      return right(
        maybeAccounts.filter(isRight).map(account => account.right)[0]
      );
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  add: async account => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(account.id))
        .create(Model.Codec.encode(account));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  update: async account => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(account.id))
        .update(Model.Codec.encode(account));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  exists: async id => {
    return left(Errors.NotImplemented.C());
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
