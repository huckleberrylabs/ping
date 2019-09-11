import { interfaces } from "inversify";
import {
  TypeName,
  TypeNameDeserializer,
  IsTypeName,
  IsSerializedTypeName,
  ITypeName,
  ISerializedTypeName,
} from "../value-objects/type-name";
import {
  IData,
  ISerializedData,
  IsSerializedData,
} from "../value-objects/data";

export type IDeserializer<Type> = (
  input: unknown,
  ioc?: interfaces.Container
) => Type;

export const DeserializerName = TypeName("Deserializer");

export const Deserializer = (ioc: interfaces.Container) => <Type extends IData>(
  serialized: ISerializedData,
  type: ITypeName | ISerializedTypeName
): Type => {
  // Invalid TypeName
  if (!IsTypeName(type) || !IsSerializedTypeName(type)) {
    throw new Error("cannot deserialize, data type provided is not valid");
  }
  // Invalid Data (Not Serialized)
  if (!IsSerializedData(serialized)) {
    throw new Error("cannot deserialize, data provided is not serialized");
  }
  try {
    const typeName = IsSerializedTypeName(type)
      ? TypeNameDeserializer(type)
      : type;
    const deserializer = ioc.getNamed<IDeserializer<Type>>(
      typeName,
      DeserializerName
    );
    return deserializer(serialized, ioc);
  } catch (error) {
    throw new Error(
      `cannot deserialize, data type provided is not valid in this context`
    );
  }
};
