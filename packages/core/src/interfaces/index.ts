export interface INewable<T> {
  new (...args: any[]): T;
}

export type JSONPrimitive = boolean | number | string | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export interface JSONArray extends Array<JSONValue> {}

// Cannot be undefined or a function
export type IData = boolean | number | string | null | symbol | bigint | object; // includes Arrays and null

export type ISerializedData = JSONValue;
