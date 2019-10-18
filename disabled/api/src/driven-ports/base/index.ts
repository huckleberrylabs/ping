import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import { tryCatch, map } from "fp-ts/lib/Either";
import { FireStore } from "../../driven-adapters";
import {
  KebabCaseString,
  UUID,
  Json,
  Errors,
  Results,
} from "@huckleberryai/core";

export const add = (store: FireStore.T) => (
  collection: KebabCaseString.T
) => async (id: UUID.T, data: Json.JObject) =>
  pipe(
    tryCatch(
      () =>
        store
          .collection(collection)
          .doc(UUID.Codec.encode(id))
          .create(data),
      () => Errors.Adapter.C()
    ),
    map(() => true)
  );
export const get = (store: FireStore.T) => (collection: KebabCaseString.T) => <
  Type
>() => async (id: UUID.T): Promise<Type | null> => {
  const json = (await store
    .collection(collection)
    .doc(id)
    .get()).data();
  return isType(json) ? json : null;
};

export const getByProperty = (store: FireStore.T) => (
  collection: KebabCaseString.T
) => <PropType, Type>(
  propKey: string,
  isType: (input: unknown) => input is Type
) => async (property: PropType): Promise<Type[] | null> => {
  const queryRef = await store
    .collection(collection)
    .where(propKey, "==", property)
    .get();
  return queryRef.empty
    ? null
    : queryRef.docs.map(doc => doc.data()).filter(isType);
};
