import { Firestore } from "@google-cloud/firestore";
import { KebabCaseString, UUID, JSONObject, JSON } from "@huckleberryai/core";

export const add = (store: Firestore) => (
  collection: KebabCaseString
) => async <Type extends JSONObject>(id: UUID, data: Type): Promise<void> => {
  await store
    .collection(collection)
    .doc(id)
    .set(data);
};

export const get = (store: Firestore) => (collection: KebabCaseString) => <
  Type extends JSONObject
>(
  isType: (input: unknown) => input is Type
) => async (id: UUID): Promise<Type | null> => {
  const json = (await store
    .collection(collection)
    .doc(id)
    .get()).data();
  return isType(json) ? json : null;
};

export const getByProperty = (store: Firestore) => (
  collection: KebabCaseString
) => <PropType extends JSON, Type extends JSONObject>(
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
