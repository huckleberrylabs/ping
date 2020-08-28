import { left, isLeft, right, isRight } from "fp-ts/lib/Either";
import { IAccountRepository, IFireStore } from "../../../interfaces";
import {
  NameSpaceCaseString,
  UUID,
  Errors,
  EmailAddress,
} from "../../../values";
import * as Model from "../model";

export const Name = "auth:repository:account" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IAccountRepository => ({
  get: async id => {
    try {
      const json = (
        await store
          .collection(Name)
          .doc(UUID.Encode(id))
          .get()
      ).data();
      if (!json)
        return left(Errors.NotFound.C(Name, `get: ${id}`, `Widget not found.`));
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
  getByEmail: async email => {
    try {
      const queryRef = await store
        .collection(Name)
        .where("email.address", "==", EmailAddress.Encode(email))
        .get();
      if (queryRef.empty)
        return left(
          Errors.NotFound.C(
            Name,
            `getByEmail: Account with email ${email} not found`,
            `Account with email ${email} not found.`
          )
        );
      const json = queryRef.docs.map(doc => doc.data());
      const maybeAccounts = json.map(Model.Decode);
      if (maybeAccounts.some(isLeft)) {
        return left(
          Errors.Adapter.C(
            Name,
            `getByAccount: ${email} has ${
              maybeAccounts.filter(isLeft).length
            } decode errors`,
            "A database error occured, please try again later or contact support."
          )
        );
      } else {
        return right(
          maybeAccounts.filter(isRight).map(account => account.right)[0]
        );
      }
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `getByEmail: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  add: async account => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(account.id))
        .create(Model.Encode(account));
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
  update: async account => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(account.id))
        .update(Model.Encode(account));
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
          Errors.NotFound.C(Name, `exists: ${id}`, "Account not found.")
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
