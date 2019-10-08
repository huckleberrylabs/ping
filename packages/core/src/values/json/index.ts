export type JSONPrimitive = boolean | number | string | null;
export type JSON = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSON };
export interface JSONArray extends Array<JSON> {}

export const IsJSONPrimitive = (input: unknown): input is JSONPrimitive =>
  typeof input === "boolean" ||
  typeof input === "number" ||
  typeof input === "string" ||
  input === null;

export const IsJSONArray = (input: unknown): input is JSONArray =>
  Array.isArray(input) && input.every(IsJSON);

export const IsJSONObject = (input: unknown): input is JSONObject =>
  typeof input === "object" &&
  input !== null &&
  Object.entries(input).every(elem => IsJSON(elem[1]));

export const IsJSON = (input: unknown): input is JSON =>
  IsJSONPrimitive(input) || IsJSONArray(input) || IsJSONObject(input);
