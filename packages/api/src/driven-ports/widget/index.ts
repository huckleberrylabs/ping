import { Either, left, isLeft, right } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberrylabs/core";
import { Interfaces, Widget } from "@huckleberrylabs/ping";
import { FireStore } from "../../driven-adapters";

export const Name = "ping:widget";

export const C = (store: FireStore.T): Interfaces.WidgetRepository => ({
  get: async (
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Widget.T>> => {
    const json = (
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(id))
        .get()
    ).data();
    if (!json) return left(Errors.NotFound.C());
    const settings = Widget.Codec.decode(json);
    if (isLeft(settings)) return left(Errors.Adapter.C());
    return settings;
  },
  add: async (widget: Widget.T): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(widget.id))
        .create(Widget.Codec.encode(widget));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  update: async (
    widget: Widget.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>> => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(widget.id))
        .update(Widget.Codec.encode(widget));
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  remove: async (id: UUID.T): Promise<Either<Errors.Adapter.T, null>> => {
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
