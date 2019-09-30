import { IsNonNullObject } from "../non-null-object";

export type JSONPrimitive = boolean | number | string | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export interface JSONArray extends Array<JSONValue> {}

// TS 3.7
/* type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>; */

export type Data = JSONValue;

/** Determines if Input is valid JSON  */
export const IsData = (input: unknown): input is Data =>
  typeof input === "boolean" ||
  typeof input === "number" ||
  typeof input === "string" ||
  input === null ||
  (Array.isArray(input) && input.every(IsData)) ||
  (IsNonNullObject(input) &&
    Object.entries(input).every(elem => IsData(elem[1])));
