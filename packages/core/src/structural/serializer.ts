import { interfaces } from "inversify";
import { IData, ISerializedData, IsData } from "../value-objects/data";
import { TypeName, ITypeName, IsTypeName } from "../value-objects/type-name";

export type ISerializer<Type, SerializedType> = (
  input: Type,
  ioc?: interfaces.Container
) => SerializedType;

export const SerializerName = TypeName("Serializer");

export const Serializer = (ioc: interfaces.Container) => <Type extends IData>(
  data: Type,
  type: ITypeName
): ISerializedData => {
  if (!IsTypeName(type)) {
    throw new Error("cannot serialize, invalid typeName");
  }
  if (!IsData(data)) {
    throw new Error("cannot serialize, not serializable data");
  }
  try {
    const serializer = ioc.getNamed<ISerializer<Type, ISerializedData>>(
      type,
      SerializerName
    );
    return serializer(data, ioc);
  } catch (error) {
    throw new Error(`cannot serialize, ${error.toString()}`);
  }
};
