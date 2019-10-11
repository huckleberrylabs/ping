import { Firestore } from "@google-cloud/firestore";
import { KebabCaseString, UUID } from "@huckleberryai/core";

export const add = (store: Firestore) => (
  collection: KebabCaseString.T
) => async <Type>(id: UUID.T, data: Type): Promise<void> => {
  await store
    .collection(collection)
    .doc(id)
    .create(data);
};

export const get = (store: Firestore) => (collection: KebabCaseString.T) => <
  Type
>(
  isType: (input: unknown) => input is Type
) => async (id: UUID.T): Promise<Type | null> => {
  const json = (await store
    .collection(collection)
    .doc(id)
    .get()).data();
  return isType(json) ? json : null;
};

export const getByProperty = (store: Firestore) => (
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
