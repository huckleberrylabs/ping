import { left, isLeft, right, isRight } from "fp-ts/lib/Either";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import { IChannelRepository, IFireStore } from "../../../interfaces";
import * as Model from "../model";

export const Name = "messaging:repository:channel" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IChannelRepository => ({
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
  getByAccount: async account => {
    try {
      const queryRef = await store
        .collection(Name)
        .where("account", "==", account)
        .get();
      if (queryRef.empty) return left(Errors.NotFound.C());
      const json = queryRef.docs.map(doc => doc.data());
      const maybeChannels = json.map(json => {
        const maybeDecoded = Model.Codec.decode(json);
        if (isLeft(maybeDecoded)) return left(Errors.Validation.C());
        return maybeDecoded;
      });
      if (maybeChannels.some(isLeft)) return left(Errors.Adapter.C());
      return right(maybeChannels.filter(isRight).map(channel => channel.right));
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  add: async channel => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(channel.id))
        .create(Model.Codec.encode(channel));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  update: async channel => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(channel.id))
        .update(Model.Codec.encode(channel));
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
