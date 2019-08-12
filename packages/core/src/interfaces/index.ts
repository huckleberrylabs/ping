import { Type } from "../type";
import { TimeStamp } from "../timestamp";
import { ID } from "../id";

export interface Newable<T> {
  new (...args: any[]): T;
}

export interface WithTypeStamp {
  timestamp: TimeStamp;
}

export interface WithType {
  type: Type;
}

export interface WithID {
  id: ID;
}

export interface WithContextID {
  contextID: ID;
}

export interface WithOriginID {
  originID: ID;
}

export interface WithCorrID {
  corrID: ID;
}

export interface WithParentID {
  parentID?: ID;
}

export interface WithSerialize {
  toJSON: () => string | object;
}

export interface WithDeserialize<Type> {
  fromJSON: (input: string) => Type;
}

export interface IEventStatic
  extends Newable<IEvent>,
    WithType,
    WithDeserialize<IEvent> {}
export interface IEvent
  extends WithType,
    WithTypeStamp,
    WithID,
    WithContextID,
    WithOriginID,
    WithCorrID,
    WithParentID,
    WithSerialize {}

export function isEvent(object: any): object is IEvent {
  if (object) {
    return (
      "type" in object &&
      "timestamp" in object &&
      "id" in object &&
      "contextID" in object &&
      "originID" in object &&
      "corrID" in object
    );
  }
  return false;
}

export interface IEventHandlerStatic extends Newable<IEventHandler>, WithType {}
export interface IEventHandler extends WithID {
  handle(event: IEvent): Promise<IResult | IEvent | IEvent[] | void>;
}

export interface IResultStatic
  extends Newable<IResult>,
    WithDeserialize<IResult> {}
export interface IResult
  extends WithType,
    WithTypeStamp,
    WithID,
    WithContextID,
    WithOriginID,
    WithCorrID,
    WithParentID,
    WithSerialize {
  parentID: ID;
  data: any;
}

export function isResult(object: any): object is IResult {
  if (object) {
    return (
      "type" in object &&
      "timestamp" in object &&
      "id" in object &&
      "contextID" in object &&
      "originID" in object &&
      "corrID" in object &&
      "parentID" in object &&
      "data" in object
    );
  }
  return false;
}

export interface IPolicy extends WithID {}

export interface IPolicyStatic extends Newable<IPolicy>, WithID {}

export interface ITask extends WithType, WithID {
  description: string;
}

export interface ITaskStatic extends Newable<ITask>, WithType, WithID {
  description: string;
}
