import { Container } from "inversify";
import { ISerializer, IData, ISerializedData } from "../interfaces";
import { IResult, Result } from "../result";
import { UUID } from "../value-objects/uuid";
import {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../value-objects/status-code";
import { TypeName, ITypeName, IsTypeName } from "../value-objects/type-name";
import { IsData } from "../helpers";

export const SerializerName = TypeName("Serializer");

export const SerializerFactory = (ioc: Container) => <Type extends IData>(
  data: Type,
  type: ITypeName
): IResult<ISerializedData> => {
  const ORIGIN_ID = UUID("6b511d57-99b6-4264-b901-f184b851f378");
  if (!IsTypeName(type)) {
    return Result(
      `Serializer: invalid TypeName`,
      SerializerName,
      BAD_REQUEST,
      ORIGIN_ID
    );
  }
  if (!IsData(data)) {
    return Result(
      `Serializer: invalid Data`,
      SerializerName,
      BAD_REQUEST,
      ORIGIN_ID
    );
  }

  try {
    const serializer = ioc.getNamed<ISerializer<Type, ISerializedData>>(
      type,
      SerializerName
    );
    return Result(serializer(data), SerializerName, OK, ORIGIN_ID);
  } catch (error) {
    return Result(
      `Serializer: ${error.toString()}`,
      SerializerName,
      INTERNAL_SERVER_ERROR,
      ORIGIN_ID
    );
  }
};
