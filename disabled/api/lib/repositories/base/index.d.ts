import * as iots from "io-ts";
import { Firestore } from "@google-cloud/firestore";
import { KebabCaseString, UUID, Json } from "@huckleberryai/core";
export declare const add: (store: Firestore) => (collection: iots.Branded<string, KebabCaseString.Brand>) => (id: iots.Branded<string, UUID.Brand>, data: Json.JObject) => Promise<FirebaseFirestore.WriteResult>;
export declare const get: (store: Firestore) => (collection: iots.Branded<string, KebabCaseString.Brand>) => <Type>() => (id: iots.Branded<string, UUID.Brand>) => Promise<Type | null>;
export declare const getByProperty: (store: Firestore) => (collection: iots.Branded<string, KebabCaseString.Brand>) => <PropType, Type>(propKey: string, isType: (input: unknown) => input is Type) => (property: PropType) => Promise<Type[] | null>;
//# sourceMappingURL=index.d.ts.map