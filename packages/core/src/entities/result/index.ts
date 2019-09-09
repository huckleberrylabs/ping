import {
  IData,
  ISerializedData,
  IsData,
  IsSerializedData,
} from "../../value-objects/data";
import { IUUID } from "../../value-objects/uuid";
import {
  TypeName,
  ITypeName,
  ISerializedTypeName,
  IsTypeName,
  IsSerializedTypeName,
  TypeNameSerializer,
  TypeNameDeserializer,
} from "../../value-objects/type-name";
import {
  IStatusCode,
  ISerializedStatusCode,
  IsStatus,
  IsSerializedStatus,
} from "../../value-objects/status-code";
import {
  IEvent,
  ISerializedEvent,
  Event,
  IsEvent,
  IsSerializedEvent,
  EventSerializer,
  EventDeserializer,
} from "../event";

export interface IResult<Type extends IData> extends IEvent {
  data: Type;
  dataType: ITypeName;
  status: IStatusCode;
}

export interface ISerializedResult<Type extends ISerializedData>
  extends ISerializedEvent {
  data: Type;
  dataType: ISerializedTypeName;
  status: ISerializedStatusCode;
}

export const ResultName = TypeName("Result");

const hasAllProperties = (input: object): boolean => {
  const hasData = "data" in input;
  const hasDataType = "dataType" in input;
  const hasStatus = "status" in input;
  return hasData && hasDataType && hasStatus;
};

export const IsResult = (input: unknown): input is IResult<IData> => {
  // Must be an Event
  if (!IsEvent(input)) {
    return false;
  }
  // Must have Result Type
  if (input.type !== ResultName) {
    return false;
  }
  if (!hasAllProperties(input)) {
    return false;
  }
  const { data, dataType, status } = <IResult<IData>>input;
  // Must have Data
  if (!IsData(data)) {
    return false;
  }
  // Must have Data Type
  if (!IsTypeName(dataType)) {
    return false;
  }
  // Must have valid Status Code
  if (!IsStatus(status)) {
    return false;
  }
  return true;
};

export const IsSerializedResult = (
  input: unknown
): input is ISerializedResult<ISerializedData> => {
  // Must be an Event
  if (!IsSerializedEvent(input)) {
    return false;
  }
  // Must have Result Type
  if (TypeName(input.type) !== ResultName) {
    return false;
  }
  if (!hasAllProperties(input)) {
    return false;
  }
  const { data, dataType, status } = <ISerializedResult<ISerializedData>>input;
  // Must have Serialized Data
  if (!IsSerializedData(data)) {
    return false;
  }
  // Must have Data Type
  if (!IsSerializedTypeName(dataType)) {
    return false;
  }
  // Must have valid Status Code
  if (!IsSerializedStatus(status)) {
    return false;
  }
  return true;
};

export const Result = <Type extends IData>(
  data: Type,
  dataType: ITypeName,
  status: IStatusCode,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID
): IResult<Type> => {
  const event = Event(ResultName, origin, corr, parent);
  if (!IsData(data)) {
    throw new Error("Invalid Data");
  }
  if (!IsTypeName(dataType)) {
    throw new Error("Invalid Data TypeName");
  }
  if (!IsStatus(status)) {
    throw new Error("Invalid Status");
  }
  const result = {
    ...event,
    data,
    dataType,
    status,
  };
  return result;
};

export const ResultSerializer = <Type extends ISerializedData>(
  input: IResult<Type>
): ISerializedResult<Type> => {
  if (!IsResult(input)) {
    throw new Error("ResultSerializer: not a valid Result");
  }
  const event = EventSerializer(input);
  const result = {
    ...event,
    data: input.data,
    dataType: TypeNameSerializer(input.dataType),
    status: input.status,
  };
  return result;
};

export const ResultDeserializer = (
  input: unknown
): IResult<ISerializedData> => {
  if (!IsSerializedResult(input)) {
    throw new Error("ResultDeserializer: not a valid Result");
  }
  const event = EventDeserializer(input);
  const result = {
    ...event,
    data: input.data,
    dataType: TypeNameDeserializer(input.dataType),
    status: input.status,
  };
  return result;
};
