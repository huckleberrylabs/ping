/* import { Either, left, isLeft, isRight, right } from "fp-ts/lib/Either";
import {
  UUID,
  Errors,
  Message,
  NameSpaceCaseString,
} from "@huckleberrylabs/ping-core";
import { FireStore } from "../../adapters";

export const Name = "message" as NameSpaceCaseString.T;

export const C = (store: FireStore.T): IMessageRepository => ({
  get: async (
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Message.Model.T>> => {
    try {
      const queryRef = await store
        .collection(Name)
        .where("message", "==", id)
        .get();
      if (queryRef.empty) return left(Errors.NotFound.C());
      const json = queryRef.docs.map(doc => doc.data());
      const maybeMessages = json.map(message => {
        if (!message.type) return left(Errors.Validation.C());
        const messageMaybe = Message.Codec.decode(message);
        if (isLeft(messageMaybe)) return left(Errors.Validation.C());
        return messageMaybe;
      });
      if (maybeMessages.some(isLeft)) return left(Errors.Adapter.C());
      return right(maybeMessages.filter(isRight).map(message => message.right));
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  add: async (message: Message.T): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Codec.encode(message.id))
        .create(Message.Model.Codec.encode(message));
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
 */
