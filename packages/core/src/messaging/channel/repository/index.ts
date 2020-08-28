import { left, isLeft, right, isRight } from "fp-ts/lib/Either";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import { IChannelRepository, IFireStore } from "../../../interfaces";
import * as Model from "../model";

export const Name = "messaging:repository:channel" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IChannelRepository => ({
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
          Errors.NotFound.C(Name, `get: ${id}`, `Channel not found.`)
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
          Errors.NotFound.C(`getByAccount: ${account}`, `No channel found.`)
        );
      const json = queryRef.docs.map(doc => doc.data());
      const maybeChannels = json.map(Model.Decode);
      if (maybeChannels.some(isLeft))
        return left(
          Errors.Validation.C(
            Name,
            `getByAccount: ${account} has ${
              maybeChannels.filter(isLeft).length
            } decoding errors.`,
            "A database error occured, please try again later or contact support."
          )
        );
      return right(maybeChannels.filter(isRight).map(channel => channel.right));
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `getByAccount: ${error.message}.`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  add: async channel => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(channel.id))
        .create(Model.Encode(channel));
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
  update: async channel => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(channel.id))
        .update(Model.Encode(channel));
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
          Errors.NotFound.C(Name, `exists: ${id}`, "Router not found.")
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
