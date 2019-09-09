import { Container } from "inversify";
import { IResult, Result } from "../result";
import { UUID } from "../value-objects/uuid";
import {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../value-objects/status-code";
import {
  TypeName,
  TypeNameDeserializer,
  IsTypeName,
  IsSerializedTypeName,
  ITypeName,
  ISerializedTypeName,
  TypeNameSerializer,
} from "../value-objects/type-name";
import {
  IData,
  ISerializedData,
  IsSerializedData,
} from "../value-objects/data";

export type IDeserializer<Type> = (input: unknown) => Type;

export const DeserializerName = TypeName("Deserializer");

export const Deserializer = (ioc: Container) => <Type extends IData>(
  serialized: ISerializedData,
  type: ITypeName | ISerializedTypeName
): IResult<IData> => {
  const ORIGIN_ID = UUID("6b511d57-99b6-4264-b901-f184b851f378");

  // Invalid TypeName
  if (!IsTypeName(type) || !IsSerializedTypeName(type)) {
    return Result(
      `Deserializer: invalid TypeName: ${
        IsTypeName(type) ? TypeNameSerializer(type) : type
      }`,
      DeserializerName,
      BAD_REQUEST,
      ORIGIN_ID
    );
  }

  // Invalid Data (Not Serialized)
  if (!IsSerializedData(serialized)) {
    return Result(
      `Deserializer: invalid data`,
      DeserializerName,
      BAD_REQUEST,
      ORIGIN_ID
    );
  }

  try {
    const typeName = IsSerializedTypeName(type)
      ? TypeNameDeserializer(type)
      : type;
    const deserializer = ioc.getNamed<IDeserializer<Type>>(
      typeName,
      DeserializerName
    );
    return Result(deserializer(serialized), typeName, OK, ORIGIN_ID);
  } catch (error) {
    return Result(
      `Deserializer: ${error.toString()}`,
      DeserializerName,
      INTERNAL_SERVER_ERROR,
      ORIGIN_ID
    );
  }
};
