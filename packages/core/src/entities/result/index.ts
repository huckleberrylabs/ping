import {
  UUID,
  Data,
  IsData,
  Type,
  IsType,
  StatusCode,
  IsStatusCode,
  IsNonNullObject,
} from "../../value-objects";
import { IEvent, Event, IsEvent } from "../event";

export interface IResult<DataType extends Data> extends IEvent {
  data: DataType;
  dataType: Type;
  status: StatusCode;
}

export const ResultType: Type = "result";

export const Result = <DataType extends Data>(
  data: DataType,
  dataType: Type,
  status: StatusCode,
  origin: UUID,
  corr?: UUID,
  parent?: UUID
): IResult<DataType> => {
  const event = Event(ResultType, origin, corr, parent);
  if (!IsData(data))
    throw new Error(`ResultConstructor: invalid data: ${data}`);
  if (!IsType(dataType))
    throw new Error(`ResultConstructor: invalid dataType: ${dataType} `);
  if (!IsStatusCode(status))
    throw new Error(`ResultConstructor: invalid status: ${status}`);
  return {
    ...event,
    data,
    dataType,
    status,
  };
};

export const IsResult = (input: unknown): input is IResult<Data> =>
  IsNonNullObject(input) &&
  IsEvent(input) &&
  input.type === ResultType &&
  IsData(input.data) &&
  IsType(input.type) &&
  IsStatusCode(input.status);

export const IsSuccess = (input: IResult<any>): boolean =>
  input.status <= 299 && input.status >= 200;

export const IsError = (input: IResult<any>): boolean => !IsSuccess(input);
