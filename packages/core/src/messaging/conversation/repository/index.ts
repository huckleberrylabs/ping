import { left, right, isLeft, isRight } from "fp-ts/lib/Either";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import { IConversationRepository, IFireStore } from "../../../interfaces";
import * as Model from "../model";

export const Name = "messaging:repository:conversation" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IConversationRepository => ({
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
          Errors.NotFound.C(Name, `get: ${id}`, `Conversation not found.`)
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
            "No conversations found."
          )
        );
      const json = queryRef.docs.map(doc => doc.data());
      const conversations = json.map(Model.Decode);
      if (conversations.some(isLeft))
        return left(
          Errors.Validation.C(
            Name,
            `getByAccount: ${account} has ${
              conversations.filter(isLeft).length
            } decode errors`,
            "A database error occured, please try again later or contact support."
          )
        );
      return right(
        conversations.filter(isRight).map(conversation => conversation.right)
      );
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
  add: async conversation => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(conversation.id))
        .create(Model.Encode(conversation));
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
  update: async conversation => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(conversation.id))
        .update(Model.Encode(conversation));
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
          Errors.NotFound.C(Name, `exists: ${id}`, `Conversation not found.`)
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
