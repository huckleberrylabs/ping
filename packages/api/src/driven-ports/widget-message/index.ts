import {
  Either,
  left,
  isLeft,
  isRight,
  right,
  tryCatch,
  map,
} from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberryai/core";
import { Interfaces, Message } from "@huckleberryai/widget";
import { FireStore } from "../../driven-adapters";
import { Codecs } from "../../codecs";
import { pipe } from "fp-ts/lib/pipeable";

export const WidgetMessageRepository = (
  store: FireStore.T
): Interfaces.MessageRepository => ({
  add: async (
    id: UUID.T,
    event: Message.Events
  ): Promise<Either<Errors.Adapter.T, null>> =>
    pipe(
      tryCatch(
        async () =>
          await store
            .collection("widget:message")
            .doc(UUID.Codec.encode(id))
            .create(event),
        () => Errors.Adapter.C()
      ),
      map(() => null)
    ),
  get: async (
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Message.T>> => {
    try {
      const queryRef = await store
        .collection("widget:message")
        .where("message", "==", id)
        .get();
      if (queryRef.empty) return left(Errors.NotFound.C());
      const json = queryRef.docs.map(doc => doc.data());
      const maybeEvents = json.map(event => {
        if (!event.type) return left(Errors.Validation.C());
        const codec = Codecs.get(event.type);
        if (!codec) return left(Errors.Validation.C());
        const maybeDecoded = codec.decode(event);
        if (isLeft(maybeDecoded)) return left(Errors.Validation.C());
        return maybeDecoded;
      });
      if (maybeEvents.some(isLeft)) return left(Errors.Adapter.C());
      return right(maybeEvents.filter(isRight).map(event => event.right));
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  remove: async (id: UUID.T): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      await store
        .collection("widget:message")
        .doc(UUID.Codec.encode(id))
        .delete();
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
});
