import { ITypeName, IUUID } from "../value-objects";
import { IEvent } from "../event";
import { IResult } from "../result";

export interface INewable<T> {
  new (...args: any[]): T;
}

export interface WithType {
  type: ITypeName;
}

export type JSONPrimitive = boolean | number | string | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export interface JSONArray extends Array<JSONValue> {}

// Cannot be undefined or a function
export type IData = boolean | number | string | null | symbol | bigint | object; // includes Arrays and null
export type ISerializedData = JSONValue;

export type ISerializer<Type, SerializedType> = (input: Type) => SerializedType;
export type IDeserializer<Type> = (input: unknown) => Type;

export interface IEventHandler {
  id: IUUID;
  handle(event: IEvent): Promise<IResult<IData>>;
}
