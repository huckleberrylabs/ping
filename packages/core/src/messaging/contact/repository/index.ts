import { left, isLeft, right, isRight } from "fp-ts/lib/Either";
import { UUID, Errors, NameSpaceCaseString, Phone } from "../../../values";
import { IContactRepository, IFireStore } from "../../../interfaces";
import * as Model from "../model";

export const Name = "messaging:repository:contact" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IContactRepository => ({
  get: async id => {
    try {
      const json = (
        await store
          .collection(Name)
          .doc(UUID.Encode(id))
          .get()
      ).data();
      if (!json)
        return left(
          Errors.NotFound.C(Name, `get: ${id}`, `Contact not found.`)
        );
      const settings = Model.Decode(json);
      if (isLeft(settings))
        return left(
          Errors.Validation.C(
            Name,
            `get: ${id}`,
            "A database error occured, please try again later or contact support."
          )
        );
      return settings;
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `get: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  getByAccount: async account => {
    try {
      const queryRef = await store
        .collection(Name)
        .where("account", "==", UUID.Encode(account))
        .get();
      if (queryRef.empty)
        return left(
          Errors.NotFound.C(
            Name,
            `getByAccount: account ${account}`,
            "No contacts found."
          )
        );
      const json = queryRef.docs.map(doc => doc.data());
      const maybeContacts = json.map(Model.Decode);
      if (maybeContacts.some(isLeft))
        return left(
          Errors.Validation.C(
            Name,
            `getByAccount: ${account} has ${
              maybeContacts.filter(isLeft).length
            } decode errors`,
            "A database error occured, please try again later or contact support."
          )
        );
      return right(maybeContacts.filter(isRight).map(contact => contact.right));
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `getByAccount: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  getByPhone: async (account, phone) => {
    try {
      const queryRef = await store
        .collection(Name)
        .where("account", "==", UUID.Encode(account))
        .where("phone.number", "==", Phone.Encode(phone))
        .get();
      if (queryRef.empty)
        return left(
          Errors.NotFound.C(
            Name,
            `getByPhone: account ${account} phone ${phone}`,
            "No contacts found."
          )
        );
      const json = queryRef.docs.map(doc => doc.data());
      const maybeContacts = json.map(Model.Decode);
      if (maybeContacts.some(isLeft))
        return left(
          Errors.Validation.C(
            Name,
            `getByPhone: ${account} has ${
              maybeContacts.filter(isLeft).length
            } decode errors`,
            "A database error occured, please try again later or contact support."
          )
        );
      return right(
        maybeContacts.filter(isRight).map(contact => contact.right)[0]
      );
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `getByPhone: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  add: async contact => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(contact.id))
        .create(Model.Encode(contact));
      return right(null);
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `add: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  update: async contact => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(contact.id))
        .update(Model.Encode(contact));
      return right(null);
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `update: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  exists: async id => {
    try {
      const exists = (
        await store
          .collection(Name)
          .doc(UUID.Encode(id))
          .get()
      ).exists;
      if (!exists) {
        return left(
          Errors.NotFound.C(Name, `exists: ${id}`, `Contact not found.`)
        );
      } else {
        return right(null);
      }
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `exists: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  remove: async id => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(id))
        .delete();
      return right(null);
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `remove: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
});
