import { left, isLeft, right, isRight } from "fp-ts/lib/Either";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import { IContactRepository, IFireStore } from "../../../interfaces";
import * as Model from "../model";

export const Name = "messaging:repository:contact" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IContactRepository => ({
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
  getByPhone: async (account, phone) => {
    try {
      const queryRef = await store
        .collection(Name)
        .where("account", "==", account)
        .where("phone.phone", "==", phone)
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
  add: async widget => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(widget.id))
        .create(Model.Codec.encode(widget));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  update: async widget => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(widget.id))
        .update(Model.Codec.encode(widget));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  exists: async id => {
    return left(Errors.NotImplemented.C());
  },
  remove: async id => {
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
