import { IData, ISerializedData } from "../interfaces";
import { IUUID } from "../value-objects/uuid";
import { TypeName } from "../value-objects/type-name";
import {
  IStatusCode,
  ISerializedStatusCode,
  IsStatus,
  IsSerializedStatus,
} from "../value-objects/status-code";
import {
  IEvent,
  ISerializedEvent,
  Event,
  IsEvent,
  IsSerializedEvent,
  EventSerializer,
  EventDeserializer,
} from "../event";
import { IsData, IsSerializedData } from "../helpers";

export interface IResult<Type extends IData> extends IEvent {
  data: Type;
  status: IStatusCode;
}

export interface ISerializedResult<Type extends ISerializedData>
  extends ISerializedEvent {
  data: Type;
  status: ISerializedStatusCode;
}

export const ResultName = TypeName("Result");

export const IsResult = (input: unknown): input is IResult<IData> => {
  // Must be an Event
  if (!IsEvent(input)) {
    return false;
  }
  // Must have Result Type
  if (input.type !== ResultName) {
    return false;
  }
  // Must have all properties
  const hasData = "data" in input;
  const hasStatus = "status" in input;
  if (!hasData || !hasStatus) {
    return false;
  }
  const { data, status } = <IResult<IData>>input;
  // Must have Data
  if (!IsData(data)) {
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
  // Must have all properties
  const hasData = "data" in input;
  const hasStatus = "status" in input;
  if (!hasData || !hasStatus) {
    return false;
  }
  const { data, status } = <ISerializedResult<ISerializedData>>input;
  // Must have Serialized Data
  if (!IsSerializedData(data)) {
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
  status: IStatusCode,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID
): IResult<Type> => {
  const event = Event(ResultName, origin, corr, parent);
  if (!IsData(data)) {
    throw new Error("Invalid Data");
  }
  if (!IsStatus(status)) {
    throw new Error("Invalid Status");
  }
  const result = {
    ...event,
    data,
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
    status: input.status,
  };
  return result;
};
