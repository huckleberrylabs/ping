import { left, isLeft, right } from "fp-ts/lib/Either";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import { IConversationRepository, IFireStore } from "../../../interfaces";
import * as Model from "../model";

export const Name = "messaging:repository:conversation" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IConversationRepository => ({
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
