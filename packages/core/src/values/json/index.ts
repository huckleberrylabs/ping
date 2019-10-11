export type Primitive = boolean | number | string | null;
export type T = Primitive | JObject | JArray;
export type JObject = { [member: string]: T };
export interface JArray extends Array<T> {}

export const IsPrimitive = (input: unknown): input is Primitive =>
  typeof input === "boolean" ||
  typeof input === "number" ||
  typeof input === "string" ||
  input === null;

export const IsArray = (input: unknown): input is JArray =>
  Array.isArray(input) && input.every(Is);

export const IsObject = (input: unknown): input is JObject =>
  typeof input === "object" &&
  input !== null &&
  Object.entries(input).every(elem => Is(elem[1]));

export const Is = (input: unknown): input is T =>
  IsPrimitive(input) || IsArray(input) || IsObject(input);
