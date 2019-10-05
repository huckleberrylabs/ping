import { isLeft } from "fp-ts/lib/Either";
import { UUID, JSON, IsJSON, Type, IsNonNullObject } from "../../values";
import { IEvent, Event, IsEvent } from "../event";

export interface IResult<Type extends JSON> extends IEvent {
  data: Type;
}

/** throws error */
export const Result = <DataType extends JSON>(
  type: Type,
  data: DataType,
  origin: UUID,
  corr?: UUID,
  parent?: UUID
): IResult<DataType> => {
  const event = Event(type, origin, corr, parent);
  if (isLeft(event)) throw event.left;
  if (!IsJSON(data)) throw new Error(`invalid data`);
  return {
    ...event.right,
    data,
  };
};

export const IsResult = (input: unknown): input is IResult<JSON> =>
  IsNonNullObject(input) && IsEvent(input) && IsJSON(input.data);
