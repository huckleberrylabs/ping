import {
  UUID,
  Data,
  IsData,
  Type,
  StatusCode,
  IsStatusCode,
  IsNonNullObject,
} from "../../values";
import { IEvent, Event, IsEvent } from "../event";

export interface IResult<Type extends Data> extends IEvent {
  data: Type;
  status: StatusCode;
}

export const ResultType: Type = "result";

export const Result = <Type extends Data>(
  data: Type,
  status: StatusCode,
  origin: UUID,
  corr?: UUID,
  parent?: UUID
): IResult<Type> => {
  const event = Event(ResultType, origin, corr, parent);
  if (!IsData(data))
    throw new Error(`ResultConstructor: invalid data: ${data}`);
  if (!IsStatusCode(status))
    throw new Error(`ResultConstructor: invalid status: ${status}`);
  return {
    ...event,
    data,
    status,
  };
};

export const IsResult = (input: unknown): input is IResult<Data> =>
  IsNonNullObject(input) &&
  IsEvent(input) &&
  input.type === ResultType &&
  IsData(input.data) &&
  IsStatusCode(input.status);

export const IsSuccess = (input: IResult<any>): boolean =>
  input.status <= 299 && input.status >= 200;

export const IsError = (input: IResult<any>): boolean => !IsSuccess(input);
